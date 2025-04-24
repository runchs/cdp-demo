import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';

// components
import { Row, Col, Button } from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';

// modals
import BaseModal from "@/components/modals/BaseModal";

// composable
import { convertId, CConvertType, IconvertInfo } from '@/composables/convertId'

// api
import axios from '@axios';
import { log } from "node:console";

enum COfferResult {
    Acknowledged = 'Acknowledged',
    Interested = 'Interested',
    NotInterested = 'Not Interested',
}

interface IPromotion {
    code: string;
    name: string;
    detail: string;
    action: string;
    resultTimestamp: string;
    period: string;
    eligibleCard: string[];
    offerResult: COfferResult | null;
}

interface IInfo {
    updateDate: string;
    // card 1
    nameTH: string;
    nameEN: string;
    nationalID: string;
    sweetheart: string;
    complaintLevel: string;
    // card 2
    customerGroup: string;
    complaintGroup: string;
    customerType: string;
    memberStatus: string;
    customerSegment: string;
    // card 3
    mobileNo: string;
    mobileNoDesc: string;
    callingPhone: string; //
    mailTo: string;
    address: string;
    gender: string;
    MaritalStatus: string;
    typeOfJob: string;
    // card 4
    statementChannel: string;
    lastStatementSentDate: string;
    statementSentStatus: string;
    // card 5
    lastIncreaseLimit: string;
    lastReduceLimit: string;
    lastIncome: string;
    lastCardApply: string;
    // card 6
    consentForCollect: string;
    consentForDisclose: string;
    blockedMedia: string;
    // card 7
    suggestAction: string;
    // card 8
    paymentStatus: string;
    dayPastDue: number;
    lastOverDueDate: string;
    // card 9
    suggestCards: string[];
    // card 10
    suggestPromotions: IPromotion[]
}

const offerResultOptions = [
    { label: "Acknowledged", value: "Acknowledged" },
    { label: "Interested", value: "Interested" },
    { label: "Not Interested", value: "Not Interested" },
];

const C360Tabs: React.FC = () => {
    const location = useLocation();

    const [showModal, setShowModal] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<IPromotion | null>(null);

    const convertInfo = useRef<IconvertInfo>({
        aeonId: '',
        customerId: '',
        traceId: '',
        user: ''
    });

    const [info, setInfo] = useState<IInfo>({
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
        callingPhone: '',
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
        dayPastDue: 0,
        lastOverDueDate: '',
        // card 9
        suggestCards: [],
        // card 10
        suggestPromotions: []
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        if (location.pathname === '/c360') {
            const aeonid = searchParams.get('aeonid');
            if (aeonid) {
                convertInfo.current = convertId(CConvertType.AeonId, aeonid);
            }
        } else if (location.pathname === '/information') {
            const aeonid = searchParams.get('aeonid');
            const customerid = searchParams.get('customerid');
            const traceId = searchParams.get('traceId');

            if (aeonid && customerid && traceId) {
                convertInfo.current = {
                    aeonId: aeonid,
                    customerId: customerid,
                    traceId: traceId
                };
            }
        }

        getInfo(convertInfo.current);

    }, [location]);

    const getInfo = (convertInfo: IconvertInfo) => {
        getCustomerInfo(convertInfo);
        getCustomerSegment(convertInfo);
        getCustomerProfile(convertInfo);
        getSuggestion(convertInfo);
    }

    const getCustomerInfo = (convertInfo: IconvertInfo) => {
        axios.get('/dashboard/custinfo', {
            headers: {
                'Trace-ID': convertInfo.traceId
            }, params: { aeon_id: convertInfo.aeonId, cust_id: convertInfo.customerId }
        })
            .then((response: any) => {
                const resp = response.data;

                setInfo(prev => ({
                    ...prev,
                    nationalID: resp.national_id,
                    nameTH: resp.customer_name_th,
                    nameEN: resp.customer_name_eng,
                    mobileNo: resp.mobile_no,
                    mailTo: resp.mail_to,
                    address: resp.mail_to_address,
                }));
            })
            .catch((error: any) => {
                console.error("เกิดข้อผิดพลาด:", error);
            })
            .finally(() => {

            });
    }

    const getCustomerSegment = (convertInfo: IconvertInfo) => {
        axios.get('/dashboard/custsegment', {
            headers: {
                'Trace-ID': convertInfo.traceId
            }, params: { aeon_id: convertInfo.aeonId, cust_id: convertInfo.customerId }
        })
            .then((response: any) => {
                const resp = response.data;

                setInfo(prev => ({
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
            })
            .catch((error: any) => {
                console.error("เกิดข้อผิดพลาด:", error);
            })
            .finally(() => {

            });
    }

    const getCustomerProfile = (convertInfo: IconvertInfo) => {
        axios.get('/dashboard/custprofile', {
            headers: {
                'Trace-ID': convertInfo.traceId
            }, params: { aeon_id: convertInfo.aeonId, cust_id: convertInfo.customerId }
        })
            .then((response: any) => {
                const resp = response.data;

                setInfo(prev => ({
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
                    dayPastDue: resp.day_past_due,
                    lastOverDueDate: resp.last_overdue_date,
                }));
            })
            .catch((error: any) => {
                console.error("เกิดข้อผิดพลาด:", error);
            })
            .finally(() => {

            });
    }

    const getSuggestion = (convertInfo: IconvertInfo) => {
        axios.get('/dashboard/suggestion', {
            headers: {
                'Trace-ID': convertInfo.traceId
            }, params: { aeon_id: convertInfo.aeonId, cust_id: convertInfo.customerId }
        })
            .then((response: any) => {
                const resp = response.data;

                setInfo(prev => ({
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

                console.log(info.suggestPromotions)
            })
            .catch((error: any) => {
                console.error("เกิดข้อผิดพลาด:", error);
            })
            .finally(() => {

            });
    }

    const suggestCards = () => {
        return (
            <div>
                {info.suggestCards.length > 0 ? (
                    info.suggestCards.map(card => (
                        <div>• {card}</div>
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
                {info.suggestPromotions.length > 0 ? (
                    <div>
                        <Carousel interval={5000} className="rounded-4 overflow-hidden shadow-sm bg-light">
                            {info.suggestPromotions.map((item) => (
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

        // สร้าง promotion ใหม่พร้อมค่าใหม่ที่ user เลือก
        const updatedPromotion = {
            ...selectedPromotion!,
            offerResult: value
        };

        // update state เผื่อ UI ต้องใช้ต่อ
        setSelectedPromotion(updatedPromotion);
    };

    const onSavePromotion = () => {
        console.log("ยิง api ด้วยข้อมูล:", selectedPromotion);
    };


    const moreDetailsModal = () => {
        return (
            <BaseModal
                isShow={showModal}
                onCancle={() => setShowModal(false)}
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
                                    selectedPromotion.eligibleCard.map(card => (
                                        <div>• {card}</div>
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

    return (
        <div className="bg-whit c360-wrp">
            {/* card 1 */}
            <Row className="shadow-sm info-top gx-0 bg-purple-gradient">
                <Col xs={10} className="text-start fw-bold">
                    <div className="fs-4 text-purple">{info.nameTH}</div>
                    <div className="fs-4 mb-3 text-purple">{info.nameEN}</div>
                    <div>National ID: <span className="fw-light">{info.nationalID}</span></div>
                </Col>
                <Col xs={2} className="text-start fw-bold text-center">
                    <div className="mb-2">{info.sweetheart}</div>
                    <div className="d-inline-block rounded-4 text-light bg-yellow px-4 py-2 shadow-sm w-100">{info.complaintLevel}</div>
                </Col>
            </Row>
            <div className="p-5 d-flex flex-column gap-4">
                {/* update date */}
                <div className="text-end text-secondary">CDP data update as of <span className="fw-bold">{info.updateDate}</span></div>
                {/* card 2 */}
                <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                    <Row className="fs-4 fw-bold mb-3">
                        <Col xs={4}>Customer Group:</Col>
                        <Col xs={8}>{info.customerGroup}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Complaint Group:</Col>
                        <Col xs={8}>{info.complaintGroup}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Customer Type:</Col>
                        <Col xs={8}>{info.customerType}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Member Status:</Col>
                        <Col xs={8}>{info.memberStatus}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Customer Segment:</Col>
                        <Col xs={8}>{info.customerSegment}</Col>
                    </Row>
                </div>
                {/* card 3 */}
                <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                    <Row>
                        <Col xs={4} className="fw-bold">Phone No.:</Col>
                        <Col xs={8}>{info.mobileNo} ({info.mobileNoDesc})</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Calling phone:</Col>
                        <Col xs={8}>{info.callingPhone}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Mail-to-{info.mailTo}:</Col>
                        <Col xs={8}>{info.address}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Gender:</Col>
                        <Col xs={8}>{info.gender}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Marital Status:</Col>
                        <Col xs={8}>{info.MaritalStatus}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Type of Job:</Col>
                        <Col xs={8}>{info.typeOfJob}</Col>
                    </Row>
                </div>
                {/* card 4 */}
                <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                    <Row>
                        <Col xs={4} className="fw-bold">Statement Channel:</Col>
                        <Col xs={8}>{info.statementChannel}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Last e-statement sent date:</Col>
                        <Col xs={8}>{info.lastStatementSentDate}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">E-statement sent status:</Col>
                        <Col xs={8}>{info.statementSentStatus}</Col>
                    </Row>
                </div>
                {/* card 5 */}
                <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                    <Row>
                        <Col xs={4} className="fw-bold">Last Increase limit Update:</Col>
                        <Col xs={8}>{info.lastIncreaseLimit}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Last Reduce limit Update:</Col>
                        <Col xs={8}>{info.lastReduceLimit}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Last Income Update:</Col>
                        <Col xs={8}>{info.lastIncome}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Last Card Apply Date:</Col>
                        <Col xs={8}>{info.lastCardApply}</Col>
                    </Row>
                </div>
                {/* card 6 */}
                <div className="rounded-4 bg-light p-4 text-start shadow-sm">
                    <Row>
                        <Col xs={4} className="fw-bold">Consent for collect & use:</Col>
                        <Col xs={8}>{info.consentForCollect}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Consent for disclose:</Col>
                        <Col xs={8}>{info.consentForDisclose}</Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="fw-bold">Blocked Media:</Col>
                        <Col xs={8}>{info.blockedMedia}</Col>
                    </Row>
                </div>
                {/* card 7 */}
                <div className="rounded-4 p-4 bg-yellow shadow-sm">
                    <div className="fw-bold fs-4 pb-3">Suggest Action</div>
                    <div>{info.suggestAction}</div>
                </div>
                {/* card 8 */}
                <div className="rounded-4 bg-light p-4 shadow-sm">
                    <div className="fw-bold fs-5 pb-3">Payment Status: <span className="text-success">{info.paymentStatus}</span></div>
                    <div className="d-flex justify-content-center">
                        <div className="me-5"><span className="fw-bold me-3">Day Past Due: </span >{info.dayPastDue} days</div>
                        <div className="ms-5"><span className="fw-bold me-3">Last Overdue Date: </span >{info.lastOverDueDate || '-'}</div>
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
                    <Col xs={8} className="bg-white ps-4">
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

    );
};

export default C360Tabs;
