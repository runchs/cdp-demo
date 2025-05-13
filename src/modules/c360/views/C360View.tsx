import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';

// components
import { Row, Col, Button } from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

// modals
import BaseModal from "@/components/modals/BaseModal";

// composable
import { useConvertId } from '@/composables/convertId'

// context
import { useLoader } from '@/contexts/LoaderContext';

// redux
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setConvertInfo } from '@/store/slices/convertInfoSlice';
import { setCustomerInfo, COfferResult, IPromotion, ICustomerInfo } from '@/store/slices/customerInfoSlice';

// api
import axios from '@axios';


interface IC360TabsProps {
    shouldFetch: boolean;
    onScrollTop: () => void;
}

interface IErrorState {
    DB: boolean;         // true = error
    CDP: boolean[];      // ต้องครบ 3 เส้นถึงจะเป็น error (CustSegment, Suggestion, CustProfile)
    SystemI: boolean[];  // ต้องครบ 2 เส้นถึงจะเป็น error (CustInfo, CustProfile)
    Other: boolean;
}

const C360Tabs: React.FC<IC360TabsProps> = ({ shouldFetch, onScrollTop  }) => {
    const location = useLocation();

    const [showModal, setShowModal] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<IPromotion | null>(null);

    const [errorMsg, setErrorMsg] = useState<string>('');
    const [showInfo, setShowInfo] = useState<boolean>(true);

    const { convertAeonId } = useConvertId();
    const { isLoading, setIsLoading } = useLoader();

    const dispatch = useAppDispatch();
    const convertInfo = useAppSelector(state => state.convertInfo);
    // const customerInfo = useAppSelector(state => state.customerInfo);

    const [error, setError] = useState<IErrorState>({
        DB: false,
        CDP: [false, false, false],
        SystemI: [false, false],
        Other: false,
    });

    const [customerInfo, setCustomerInfo] = useState<ICustomerInfo>({
        updateDate: '',
        // card 1
        nameTH: '',
        nameEN: '',
        nationalID: '',
        sweetheart: '',
        complaintLevel: '',
        // card 2
        customerGroup: '',
        complaintGroup: '',
        customerType: '',
        memberStatus: '',
        customerSegment: '',
        // card 3
        mobileNo: '',
        mobileNoDesc: '',
        mailTo: '',
        address: '',
        gender: '',
        MaritalStatus: '',
        typeOfJob: '',
        // card 4
        statementChannel: '',
        lastStatementSentDate: '',
        statementSentStatus: '',
        // card 5
        lastIncreaseLimit: '',
        lastReduceLimit: '',
        lastIncome: '',
        lastCardApply: '',
        // card 6
        consentForCollect: '',
        consentForDisclose: '',
        blockedMedia: '',
        // card 7
        suggestAction: '',
        // card 8
        paymentStatus: '',
        dayPastDue: '',
        lastOverDueDate: '',
        // card 9
        suggestCards: [],
        // card 10
        suggestPromotions: []
    });

    const offerResultOptions = [
        { label: "Acknowledged", value: "Acknowledged" },
        { label: "Interested", value: "Interested" },
        { label: "Not Interested", value: "Not Interested" },
    ];

    useEffect(() => {
        if (shouldFetch) {
            const searchParams = new URLSearchParams(location.search);

            if (location.pathname === '/c360') {
                const aeonid = searchParams.get('aeonid');
                if (aeonid) {
                    convertAeonId(aeonid)
                        .then((info: any) => {
                            dispatch(setConvertInfo(info));
                        })
                        .catch((msg: any) => {
                            setError((prev) => ({
                                ...prev,
                                DB: true,
                            }));
                            setErrorMsg(msg);
                        });
                }
            } else if (location.pathname === '/information') {
                const aeonid = searchParams.get('aeonid');
                const customerid = searchParams.get('customerid');
                const traceId = searchParams.get('traceId');

                if (aeonid && customerid && traceId) {
                    dispatch(setConvertInfo({
                        aeonId: aeonid,
                        customerId: customerid,
                        traceId: traceId,
                    }));
                }
            }
        }
    }, [location, shouldFetch]);

    useEffect(() => {
        if (convertInfo.aeonId && convertInfo.customerId && convertInfo.traceId) {
            const fetchAllCustomerData = async () => {
                setIsLoading(true);
                setErrorMsg('');
                let firstErrorMsg = '';

                const handleApiError = (category: keyof IErrorState, msg: string) => {
                    setError(prev => {
                        const updatedError = { ...prev } as IErrorState;

                        if (Array.isArray(prev[category])) {
                            const arr = [...(prev[category] as boolean[])];
                            const firstFalseIndex = arr.findIndex(v => v === false);

                            if (firstFalseIndex !== -1) {
                                arr[firstFalseIndex] = true;
                                (updatedError[category] as boolean[]) = arr;
                            } else {
                                console.warn(`All slots in ${category} already have errors.`);
                            }
                        } else {
                            (updatedError[category] as boolean) = true;
                        }

                        return updatedError;
                    });

                    if (!firstErrorMsg) {
                        firstErrorMsg = msg;
                    }
                };

                try {
                    await Promise.allSettled([
                        getCustomerInfo().catch((err: any) => {
                            console.error('getCustomerInfo error:', err);
                            if (err.code !== 'NOT_FOUND' && err.code !== 'NO_RESPONSE') {
                                handleApiError('Other', err.message);
                            } else {
                                handleApiError('SystemI', err.details.connector_api);
                            }
                        }),
                        getCustomerSegment().catch((err: any) => {
                            console.error('getCustomerSegment error:', err);
                            if (err.code !== 'NOT_FOUND' && err.code !== 'NO_RESPONSE') {
                                handleApiError('Other', err.message);
                            } else {
                                handleApiError('CDP', err.details.td);
                            }
                        }),
                        getCustomerProfile().catch((err: any) => {
                            console.error('getCustomerProfile error:', err);
                            if (err.code !== 'NOT_FOUND' && err.code !== 'NO_RESPONSE') {
                                handleApiError('Other', err.message);
                            } else {
                                if(err.details.connector_api) {
                                    handleApiError('SystemI', err.details.connector_api);
                                }
                                if (err.details.td) {
                                    handleApiError('CDP', err.details.td);
                                }                                
                            }
                        }),
                        getSuggestion().catch((err: any) => {
                            console.error('getSuggestion error:', err);
                            if (err.code !== 'NOT_FOUND' && err.code !== 'NO_RESPONSE') {
                                handleApiError('Other', err.message);
                            } else {
                                handleApiError('CDP', err.details.td);
                            }
                        }),
                    ]);
                    setErrorMsg(firstErrorMsg);
                } catch (err) {
                    console.error('Error in fetch:', err);
                    setErrorMsg("An error occurred during data fetching.");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchAllCustomerData();
        }
    }, [convertInfo]);

    useEffect(() => {
        const isAllError = (errors: boolean[]): boolean => errors.every(error => error);

        function checkCustomerError(errorState: IErrorState): boolean {
            const { DB, CDP, SystemI, Other } = errorState;

            const isCDPError = isAllError(CDP);
            const isSystemIError = isAllError(SystemI);

            if(isCDPError && isSystemIError) {
                if(errorMsg.includes('Not found data')) {
                    setErrorMsg('Not found data from CDP and System-i');
                } else if (errorMsg.includes('Connection issue')) {
                    setErrorMsg('Connection issue from CDP and System-i');
                }                
            }

            if (DB || Other || isCDPError) {
                return false;
            }

            if (isSystemIError) {
                return true;
            }

            return true;
        }

        const result = checkCustomerError(error);
        setShowInfo(result);
    }, [error]);


    const getCustomerInfo = () => {
        return new Promise((resolve, reject) => {
            // axios.get('/dashboard/custinfo', {
            //     headers: {
            //         'Trace-ID': convertInfo.traceId
            //     }, params: { aeon_id: convertInfo.aeonId, cust_id: convertInfo.customerId }
            // })
            //     .then((response: any) => {
            //         const resp = response.data;

                    // mock data for test
                    const resp = {
                        "national_id": "1100800391079",
                        "customer_name_eng": "MEENA TESTCDP",
                        "customer_name_th": "มีนา TESTCDP",
                        "mobile_no": "0982757360",
                        "mail_to_address": "123/364 ม.พฤกษาวิลล์ 78 ซ.13/1 ต.บางเมือง อ.เมือง จ.สมุทรปราการ 10270",
                        "mail_to": "Home"
                    }

                    setCustomerInfo(prev => ({
                        ...prev,
                        nationalID: resp.national_id,
                        nameTH: resp.customer_name_th,
                        nameEN: resp.customer_name_eng,
                        mobileNo: resp.mobile_no,
                        mailTo: resp.mail_to,
                        address: resp.mail_to_address,
                    }));

                    resolve(resp);
                // })
                // .catch((error: any) => {
                //     const err = error.response.data.error;
                //     reject(err);
                // })
        });
    }

    const getCustomerSegment = () => {
        return new Promise((resolve, reject) => {
            // axios.get('/dashboard/custsegment', {
            //     headers: {
            //         'Trace-ID': convertInfo.traceId
            //     }, params: { aeon_id: convertInfo.aeonId, cust_id: convertInfo.customerId }
            // })
            //     .then((response: any) => {
            //         const resp = response.data;

            // mock data for test
            const resp = {
                "sweetheart": "Sweetheart",
                "complaint_level": "Complaint Level: 1",
                "customer_group": "NORMAL - VIP Customer",
                "complaint_group": "",
                "customer_type": "VP",
                "member_status": "NORMAL",
                "customer_segment": "Existing Customer - Active",
                "update_data": "01 Jan 0001"
            }

            setCustomerInfo(prev => ({
                ...prev,
                sweetheart: resp.sweetheart,
                complaintLevel: resp.complaint_level,
                customerGroup: resp.customer_group,
                complaintGroup: resp.complaint_group,
                customerType: resp.customer_type,
                memberStatus: resp.member_status,
                customerSegment: resp.customer_segment,
                updateDate: resp.update_data,
            }));

            resolve(resp);
            // })
            // .catch((error: any) => {
            //     const err = error.response.data.error;
            //     reject(err);
            // })
        });
    }

    const getCustomerProfile = () => {
        return new Promise((resolve, reject) => {
            // axios.get('/dashboard/custprofile', {
            //     headers: {
            //         'Trace-ID': convertInfo.traceId
            //     }, params: { aeon_id: convertInfo.aeonId, cust_id: convertInfo.customerId }
            // })
            //     .then((response: any) => {
            //         const resp = response.data;

            // mock data for test
            const resp = {
                "error_system": null,
                "last_card_apply_date": "25 Aug 2023",
                "customer_sentiment": "",
                "phone_no_last_update_date": "01 Aug 2024",
                "last_increase_credit_limit_update": "29 Aug 2023",
                "last_reduce_credit_limit_update": "01 Jan 0001",
                "last_income_update": "29 Aug 2023",
                "suggested_action": "",
                "type_of_job": "",
                "marital_status": "",
                "gender": "",
                "last_e_statement_sent_date": "01 Jan 0001",
                "e_statement_sent_status": "",
                "statement_channel": "",
                "consent_for_disclose": "",
                "block_media": "No blocked",
                "consent_for_collect_use": "Incomplete",
                "payment_status": "On time",
                "day_past_due": "",
                "last_overdue_date": "-"
            }

            setCustomerInfo(prev => ({
                ...prev,
                lastCardApply: resp.last_card_apply_date,
                mobileNoDesc: resp.phone_no_last_update_date,
                lastIncreaseLimit: resp.last_increase_credit_limit_update,
                lastReduceLimit: resp.last_reduce_credit_limit_update,
                lastIncome: resp.last_income_update,
                suggestAction: resp.suggested_action || 'no suggest action',
                typeOfJob: resp.type_of_job,
                MaritalStatus: resp.marital_status,
                gender: resp.gender,
                lastStatementSentDate: resp.last_e_statement_sent_date,
                statementSentStatus: resp.e_statement_sent_status,
                statementChannel: resp.statement_channel,
                consentForDisclose: resp.consent_for_disclose,
                blockedMedia: resp.block_media,
                consentForCollect: resp.consent_for_collect_use,
                paymentStatus: resp.payment_status,
                dayPastDue: resp.day_past_due || "0",
                lastOverDueDate: resp.last_overdue_date,
            }));

            resolve(resp);
            // })
            // .catch((error: any) => {
            //     const err = error.response.data.error;
            //     reject(err);
            // })
        });
    }

    const getSuggestion = () => {
        return new Promise((resolve, reject) => {
            // axios.get('/dashboard/suggestion', {
            //     headers: {
            //         'Trace-ID': convertInfo.traceId
            //     }, params: { aeon_id: convertInfo.aeonId, cust_id: convertInfo.customerId }
            // })
            //     .then((response: any) => {
            //         const resp = response.data;

            // mock data for test
            const resp = {
                "suggest_cards": [
                    "Club Thailand JCB Card​",
                    "Club Thailand Mastercard​",
                    "Club Thailand Visa Card"
                ],
                "suggest_promotions": [
                    {
                        "promotion_code": "P24099EEBE",
                        "promotion_name": "BIC CAMERA Coupon with Aeon Credit Card",
                        "promotion_details": "ซื้อสินค้าปลอดภาษี สูงสุด 10%  และ รับส่วนลด สูงสุด 7% เมื่อซื้อสินค้าที่ร้าน BicCamera ประเทศญี่ปุ่น, ร้าน Air BicCamera และ ร้าน KOJIMA ด้วยบัตรเครดิตอิออนทุกประเภท (ยกเว้นบัตรเครดิตเพื่อองค์กร) ซึ่ง BicCamera เป็นห้างสรรพสินค้าในประเทศญี่ปุ่น จำหน่ายสินค้าหลากหลายประเภท เช่น เครื่องใช้ไฟฟ้า ยา เครื่องสำอาง และของใช้ในชีวิตประจำวัน โปรดแสดงภาพบาร์โค้ดบนสื่อประชาสัมพันธ์นี้ ที่แคชเชียร์",
                        "action": "test",
                        "promotion_result_timestamp": "25 Mar 2025, 14.24",
                        "period": "4 Sep 2024 - 31 Aug 2025",
                        "eligible_card": [
                            "BIG C WORLD MASTERCARD"
                        ]
                    },
                    {
                        "promotion_code": "P240362142",
                        "promotion_name": "buy insurance web aeon",
                        "promotion_details": "ลูกค้าสามารถซื้อประกันออนไลน์ผ่านทาง AEON THAI MOBILE Application ตั้งแต่วันที่  25 มีนาคม 2567 เป็นต้นไป",
                        "action": "Acknowledged",
                        "promotion_result_timestamp": "25 Feb 2025, 13.19",
                        "period": "21 Mar 2024 - 31 Dec 2025",
                        "eligible_card": [
                            "JCB CARD"
                        ]
                    },
                    {
                        "promotion_code": "P2409CB775",
                        "promotion_name": "AEON THEATRE AND AEON LOUNGE at QUARTIER CINEART21",
                        "promotion_details": "สิทธิพิเศษสำหรับผู้ถือบัตรเครดิตอิออน รอยัล ออร์คิด พลัส, บัตรเครดิตอิออน โกลด์, บัตรเครดิต วีซ่า โอลิมปิก อิออน, บัตรเครดิตอิออนคลาสสิค, บัตรเครดิตอิออน เจ-พรีเมียร์ แพลทินัม และบัตรเครดิตอิออนคลับไทยแลนด์ ที่ออกโดยบริษัท อิออน ธนสินทรัพย์ (ไทยแลนด์) จำกัด (มหาชน) (“บริษัทฯ”) ที่ใช้บริการโรงภาพยนตร์อิออน เธียเตอร์ แอท ควอเทียร์ (AEON Theatre @Quartier) ควอเทียร์ ซีเนอาร์ต ศูนย์การค้าเอ็มควอเทียร์ ชั้น 4 และชำระค่าบริการผ่านบัตรเครดิตอิออน ตามเงื่อนไขที่กำหนดของบัตรแต่ละประเภท",
                        "action": "Acknowledged",
                        "promotion_result_timestamp": "17 Feb 2025, 16.01",
                        "period": "25 Sep 2024 - 30 Sep 2025",
                        "eligible_card": [
                            "AEON ROP WORLD MASTER CARD",
                            "VISA CARD"
                        ]
                    }
                ]
            }

            setCustomerInfo(prev => ({
                ...prev,
                suggestCards: resp.suggest_cards,
                suggestPromotions: resp.suggest_promotions.length > 0 ?
                    resp.suggest_promotions.map((item: any) => ({
                        code: item.promotion_code,
                        name: item.promotion_name,
                        detail: item.promotion_details,
                        action: item.action,
                        resultTimestamp: item.promotion_result_timestamp,
                        period: item.period,
                        eligibleCard: item.eligible_card,
                        offerResult: null,
                    }))
                    : []
            }));

            resolve(resp);
            // })
            // .catch((error: any) => {
            //     const err = error.response.data.error;
            //     reject(err);
            // })
        });
    }

    const suggestCards = () => {
        return (
            <div>
                {customerInfo.suggestCards.length > 0 ? (
                    customerInfo.suggestCards.map((card, index) => (
                        <div key={index}>• {card}</div>
                    ))
                ) : (
                    <div>• No Suggestions</div>
                )}
            </div>
        );
    };

    const suggestPromotions = () => {
        return (
            <div>
                {customerInfo.suggestPromotions.length > 0 ? (
                    <div>
                        <Carousel interval={5000} className="rounded-4 overflow-hidden shadow-sm bg-light">
                            {customerInfo.suggestPromotions.map((item) => (
                                <Carousel.Item key={item.code}>
                                    <div
                                        className="d-flex flex-column promotion-wrp bg-purple-gradient"
                                    >
                                        <Row className="gx-0 align-items-center mb-1">
                                            <Col xs={8} className="fs-5 text-purple fw-bold name">{item.name}</Col>
                                            <Col xs={4} className="ps-2">
                                                <div className="text-center">
                                                    <div className="bg-yellow-light fw-bold rounded-4 shadow-sm px-2 py-1 mb-1 fs-6">{item.action}</div>
                                                    <div className="text-muted fs-8">{item.resultTimestamp}</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="fs-6">
                                            <div className="desc my-4">{item.detail}</div>
                                            <div><span className="fw-bold">Periode:</span> {item.period}</div>
                                            <div><span className="fw-bold">Eligible Card: </span>
                                                {item.eligibleCard.length > 0 ? (
                                                    <span>{item.eligibleCard.join(', ')}</span>
                                                ) : (
                                                    <span>-</span>
                                                )}</div>
                                            <Button variant="dark" className="mt-4 mb-3 fs-6 more-detail-btn shadow-sm" onClick={() => handleOpenModal(item)}>More Detail</Button>
                                        </div>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        {moreDetailsModal()}
                    </div>
                ) : (
                    <div>• No Suggestions</div>
                )}
            </div>
        );
    };

    const handleOpenModal = (item: any) => {
        setSelectedPromotion(item);
        setShowModal(true);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as COfferResult;

        const updatedPromotion = {
            ...selectedPromotion!,
            offerResult: value
        };

        setSelectedPromotion(updatedPromotion);
    };


    const moreDetailsModal = () => {
        return (
            <BaseModal
                isShow={showModal}
                onCancel={() => setShowModal(false)}
                title="Promotion Detail"
                onSave={() => onSavePromotion()}
            >
                <div className="py-3">
                    <div className="fs-5 text-purple fw-bold mb-4">{selectedPromotion?.name}</div>
                    <div className="promotion-desc p-4 rounded-4 mb-3 fs-6 bg-purple-light">{selectedPromotion?.detail}</div>
                    <Row className="p-4 rounded-4 gx-0 fs-6 bg-purple-light">
                        <Col xs={4}>
                            <div className="fw-bold mb-2">Eligible Card:</div>
                            <div>
                                {selectedPromotion?.eligibleCard && selectedPromotion.eligibleCard.length > 0 ? (
                                    selectedPromotion.eligibleCard.map((card, index) => (
                                        <div key={index}>• {card}</div>
                                    ))
                                ) : (
                                    <div>-</div>
                                )}
                            </div>
                        </Col>
                        <Col xs={4}>
                            <div className="fw-bold mb-2">Periode:</div>
                            <div>{selectedPromotion?.period}</div>
                        </Col>
                        <Col xs={4}>
                            <div className="fw-bold mb-2">Offer Result:</div>
                            <div><Form>
                                <div className="mb-3">
                                    {offerResultOptions.map((option, index) => (
                                        <Form.Check
                                            key={index}
                                            type="radio"
                                            name="radioGroup"
                                            id={`radio-${index}`}
                                            label={option.label}
                                            value={option.value}
                                            onChange={handleChange}
                                        />
                                    ))}
                                </div>
                            </Form></div>
                        </Col>
                    </Row>
                </div>
            </BaseModal>
        );
    }

    const onSavePromotion = () => {
        axios.post('/dashboard/offeresult',
            {
                aeon_id: convertInfo.aeonId,
                promotion_code: selectedPromotion?.code,
                promotion_result: selectedPromotion?.offerResult,                
            },
            {
                headers: {
                    'Trace-ID': convertInfo.traceId
                },  params: {case: 500}
            }
        )
            .then((response: any) => {
                setShowModal(false);
            })
            .catch((error: any) => {
                console.error("offeresult error:", error);

                const err = error.response.data.error;
                if(err.code === 'NOT_FOUND' || err.code === 'NO_RESPONSE') {
                    setErrorMsg(err.details.td)
                } else {
                    setErrorMsg(err.message)
                }

                setShowModal(false); 
                
                setTimeout(() => {
                    onScrollTop();
                  }, 300);
            })
            .finally(() => {

            });
    };

    // check condition color
    const getComplaintLevelColor = (level: string) => {
        switch (level) {
            case 'Complaint Level: 1':
                return 'bg-yellow ';
            case 'Complaint Level: 2':
                return 'bg-orange';
            case 'Complaint Level: 3':
                return 'bg-red';
            case 'Normal':
                return 'bg-green';
            default:
                return 'bg-secondary';
        }
    };

    const handleCustomerGroup = (group: string) => {
        if (group.includes('VVIP')) {
            const parts = group.split('VVIP');
            return (
                <span>
                    <span className="text-red">VVIP</span>
                    {parts[1]}
                </span>
            );
        }

        if (group.includes('NORMAL')) {
            const parts = group.split('NORMAL');
            return (
                <span>
                    <span className="text-green">NORMAL</span>
                    {parts[1]}
                </span>
            );
        }

        return <span>{group}</span>;
    }

    const getCallingPhoneColor = (phone: string) => {
        const searchParams = new URLSearchParams(location.search);
        const paramPhone = searchParams.get('cli');

        if (phone !== paramPhone) return 'text-red'
    }

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case '!Payment Overdue':
                return 'text-red ';
            case 'On time':
                return 'text-green';
            default:
                return;
        }
    };

    return !isLoading ? (
        <div className="bg-whit c360-wrp" >
            {/* error msg */}
            {errorMsg && (
                <Alert variant="warning" className="text-start fw-light py-2 px-3 fs-6 m-2">
                    <div>{errorMsg} {!error.DB && `(Trace ID: ${convertInfo.traceId})`}</div>
                </Alert>
            )}

            {/* card 1 */}
            {showInfo && (
                <div>
                    <Row className="shadow-sm info-top gx-0 bg-purple-gradient">
                        <Col xs={10} className="text-start fw-bold">
                            <div className="fs-4 text-purple">{customerInfo.nameTH}</div>
                            <div className="fs-4 mb-3 text-purple">{customerInfo.nameEN}</div>
                            {customerInfo.nationalID && (<div>National ID: <span className="fw-light">{customerInfo.nationalID}</span></div>)}
                        </Col>
                        <Col xs={2} className="text-start fw-bold text-center">
                            <div className="mb-2">{customerInfo.sweetheart}</div>
                            <div className={`d-inline-block rounded-4 text-light px-4 py-2 shadow-sm w-100 ${getComplaintLevelColor(customerInfo.complaintLevel)}`}>
                                {customerInfo.complaintLevel || '-'}
                            </div>
                        </Col>
                    </Row>
                    <div className="px-5 py-4 d-flex flex-column gap-3">

                        {/* update date */}
                        <div className="text-end text-secondary">CDP data update as of <span className="fw-bold">{customerInfo.updateDate}</span></div>
                        {/* card 2 */}
                        <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                            <Row className="fs-4 fw-bold mb-3">
                                <Col xs={4}>Customer Group:</Col>
                                <Col xs={8}>{handleCustomerGroup(customerInfo.customerGroup)}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Complaint Group:</Col>
                                <Col xs={8}>{customerInfo.complaintGroup}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Customer Type:</Col>
                                <Col xs={8}>{customerInfo.customerType}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Member Status:</Col>
                                <Col xs={8}>{customerInfo.memberStatus}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Customer Segment:</Col>
                                <Col xs={8}>{customerInfo.customerSegment}</Col>
                            </Row>
                        </div>
                        {/* card 3 */}
                        <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                            <Row>
                                <Col xs={4} className="fw-bold">Phone No.:</Col>
                                <Col xs={8}>{customerInfo.mobileNo} ({customerInfo.mobileNoDesc})</Col>
                            </Row>
                            {
                                (location.pathname === '/c360') && (<Row>
                                    <Col xs={4} className="fw-bold">Calling phone:</Col>
                                    <Col xs={8} className={`${getCallingPhoneColor(customerInfo.mobileNo)}`}>value7</Col>
                                </Row>)
                            }
                            <Row>
                                <Col xs={4} className="fw-bold">Mail-to-{customerInfo.mailTo}:</Col>
                                <Col xs={8}>{customerInfo.address}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Gender:</Col>
                                <Col xs={8}>{customerInfo.gender}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Marital Status:</Col>
                                <Col xs={8}>{customerInfo.MaritalStatus}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Type of Job:</Col>
                                <Col xs={8}>{customerInfo.typeOfJob}</Col>
                            </Row>
                        </div>
                        {/* card 4 */}
                        <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                            <Row>
                                <Col xs={4} className="fw-bold">Statement Channel:</Col>
                                <Col xs={8}>{customerInfo.statementChannel}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Last e-statement sent date:</Col>
                                <Col xs={8}>{customerInfo.lastStatementSentDate}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">E-statement sent status:</Col>
                                <Col xs={8}>{customerInfo.statementSentStatus}</Col>
                            </Row>
                        </div>
                        {/* card 5 */}
                        <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                            <Row>
                                <Col xs={4} className="fw-bold">Last Increase limit Update:</Col>
                                <Col xs={8}>{customerInfo.lastIncreaseLimit}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Last Reduce limit Update:</Col>
                                <Col xs={8}>{customerInfo.lastReduceLimit}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Last Income Update:</Col>
                                <Col xs={8}>{customerInfo.lastIncome}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Last Card Apply Date:</Col>
                                <Col xs={8}>{customerInfo.lastCardApply}</Col>
                            </Row>
                        </div>
                        {/* card 6 */}
                        <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                            <Row>
                                <Col xs={4} className="fw-bold">Consent for collect & use:</Col>
                                <Col xs={8}>{customerInfo.consentForCollect}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Consent for disclose:</Col>
                                <Col xs={8}>{customerInfo.consentForDisclose}</Col>
                            </Row>
                            <Row>
                                <Col xs={4} className="fw-bold">Blocked Media:</Col>
                                <Col xs={8}>{customerInfo.blockedMedia}</Col>
                            </Row>
                        </div>
                        {/* card 7 */}
                        <div className="rounded-4 p-4 bg-yellow shadow-sm">
                            <div className="fw-bold fs-4 pb-3">Suggest Action</div>
                            <div>{customerInfo.suggestAction}</div>
                        </div>
                        {/* card 8 */}
                        <div className="rounded-4 bg-light p-4 shadow-sm">
                            <div className="fw-bold fs-5 pb-3">Payment Status: <span className={`${getPaymentStatusColor(customerInfo.paymentStatus)}`}>{customerInfo.paymentStatus}</span></div>
                            <div className="d-flex justify-content-center">
                                <div className="me-5"><span className="fw-bold me-3">Day Past Due: </span >{customerInfo.dayPastDue} days</div>
                                <div className="ms-5"><span className="fw-bold me-3">Last Overdue Date: </span >{customerInfo.lastOverDueDate || '-'}</div>
                            </div>
                        </div>
                        {/* card 9, 10 */}
                        <Row className=" gx-0">
                            {/* card 9*/}
                            <Col xs={4} className="rounded-4 bg-light py-4 px-5 text-start shadow-sm">
                                <div className="fw-bold fs-5 pb-4">Suggested Cards</div>
                                <div>
                                    {suggestCards()}
                                </div>
                            </Col>
                            {/* card 10 */}
                            <Col xs={8} className="bg-white ps-3">
                                <div className="rounded-4 bg-light py-4 px-5 text-start shadow-sm">
                                    <div className="fw-bold fs-5 pb-4">Suggested Promotions</div>
                                    <div>
                                        {suggestPromotions()}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            )}

        </div>
    ) : null;
};

export default C360Tabs;
