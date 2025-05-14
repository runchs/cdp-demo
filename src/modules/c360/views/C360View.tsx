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
import { setCustomerInfo, COfferResult, IPromotion } from '@/store/slices/customerInfoSlice';
import { setErrorMsg, clearErrorMsg, setShowInfo, IErrorState, setErrorState } from '@/store/slices/errorInfoSlice';

// api
import axios from '@axios';


interface IC360TabsProps {
    shouldFetch: boolean;
    onScrollTop: () => void;
}

// interface IErrorState {
//     DB: boolean;         // true = error
//     CDP: boolean[];      // ต้องครบ 3 เส้นถึงจะเป็น error (CustSegment, Suggestion, CustProfile)
//     SystemI: boolean[];  // ต้องครบ 2 เส้นถึงจะเป็น error (CustInfo, CustProfile)
//     Other: boolean;
// }

const C360Tabs: React.FC<IC360TabsProps> = ({ shouldFetch, onScrollTop }) => {
    const location = useLocation();

    const [showModal, setShowModal] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<IPromotion | null>(null);

    const isDeeplink = useRef<boolean>(false);
    const user = useRef<string>('');

    const { convertAeonId } = useConvertId();
    const { isLoading, setIsLoading } = useLoader();

    const dispatch = useAppDispatch();
    const convertInfo = useAppSelector(state => state.convertInfo);
    const customerInfo = useAppSelector(state => state.customerInfo);
    const errorMsg = useAppSelector(state => state.errorInfo.errorMsg);
    const showInfo = useAppSelector(state => state.errorInfo.showInfo);
    const errorState = useAppSelector(state => state.errorInfo.errorState);

    const offerResultOptions = [
        { label: "Acknowledged", value: "Acknowledged" },
        { label: "Interested", value: "Interested" },
        { label: "Not Interested", value: "Not Interested" },
    ];

    useEffect(() => {
        if (shouldFetch) {
            const searchParams = new URLSearchParams(location.search);

            if (location.pathname === '/c360') {
                isDeeplink.current = true;

                const aeonid = searchParams.get('aeonid');
                if (aeonid) {
                    convertAeonId(aeonid, true)
                        .then((info: any) => {
                            dispatch(setConvertInfo(info));
                        })
                        .catch((msg: any) => {
                            dispatch(setErrorState({
                                DB: true,
                            }));
                            dispatch(setErrorMsg(msg));
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
        if (shouldFetch && convertInfo.aeonId && convertInfo.customerId && convertInfo.traceId) {
            const fetchAllCustomerData = async () => {
                setIsLoading(true);
                dispatch(clearErrorMsg());
                let firstErrorMsg = '';

                const handleApiError = (category: keyof IErrorState, msg: string) => {
                    const updatedError: IErrorState = { ...errorState };

                    if (Array.isArray(updatedError[category])) {
                        const arr = [...(updatedError[category] as boolean[])];
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

                    dispatch(setErrorState(updatedError));

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
                                if (err.details.connector_api) {
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
                    dispatch(setErrorMsg(firstErrorMsg));
                } catch (err) {
                    console.error('Error in fetch:', err);
                    dispatch(setErrorMsg("An error occurred during data fetching."));
                } finally {
                    setIsLoading(false);
                }
            };

            fetchAllCustomerData();
        }
    }, [convertInfo, shouldFetch]);

    useEffect(() => {
        const isAllError = (errors: boolean[]): boolean => errors.every(error => error);

        function checkCustomerError(errorState: IErrorState): boolean {
            const { DB, CDP, SystemI, Other } = errorState;

            const isCDPError = isAllError(CDP);
            const isSystemIError = isAllError(SystemI);

            if (isCDPError && isSystemIError) {
                if (errorMsg.includes('Not found data')) {
                    dispatch(setErrorMsg('Not found data from CDP and System-i'));
                } else if (errorMsg.includes('Connection issue')) {
                    dispatch(setErrorMsg('Connection issue from CDP and System-i'));
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

        const result = checkCustomerError(errorState);
        dispatch(setShowInfo(result));

    }, [errorState]);


    const getCustomerInfo = () => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/custinfo', {
                headers: {
                    'Trace-ID': convertInfo.traceId
                }, params: { 
                    aeon_id: convertInfo.aeonId, 
                    cust_id: convertInfo.customerId,
                    user: isDeeplink.current ? 'deeplink' : user.current,
                 }
            })
                .then((response: any) => {
                    const resp = response.data;

                    dispatch(setCustomerInfo({
                        nationalID: resp.national_id,
                        nameTH: resp.customer_name_th,
                        nameEN: resp.customer_name_eng,
                        mobileNo: resp.mobile_no,
                        mailTo: resp.mail_to,
                        address: resp.mail_to_address,
                    }));

                    resolve(resp);
                })
                .catch((error: any) => {
                    const err = error.response.data.error;
                    reject(err);
                })
        });
    }

    const getCustomerSegment = () => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/custsegment', {
                headers: {
                    'Trace-ID': convertInfo.traceId
                }, params: { 
                    aeon_id: convertInfo.aeonId, 
                    cust_id: convertInfo.customerId,
                    user: isDeeplink.current ? 'deeplink' : user.current,
                }
            })
                .then((response: any) => {
                    const resp = response.data;

                    dispatch(setCustomerInfo({
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
                })
                .catch((error: any) => {
                    const err = error.response.data.error;
                    reject(err);
                })
        });
    }

    const getCustomerProfile = () => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/custprofile', {
                headers: {
                    'Trace-ID': convertInfo.traceId
                }, params: { 
                    aeon_id: convertInfo.aeonId, 
                    cust_id: convertInfo.customerId,
                    user: isDeeplink.current ? 'deeplink' : user.current,
                 }
            })
                .then((response: any) => {
                    const resp = response.data;

                    dispatch(setCustomerInfo({
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
                })
                .catch((error: any) => {
                    const err = error.response.data.error;
                    reject(err);
                })
        });
    }

    const getSuggestion = () => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/suggestion', {
                headers: {
                    'Trace-ID': convertInfo.traceId
                }, params: { 
                    aeon_id: convertInfo.aeonId, 
                    cust_id: convertInfo.customerId,
                    user: isDeeplink.current ? 'deeplink' : user.current,
                }
            })
                .then((response: any) => {
                    const resp = response.data;

                    dispatch(setCustomerInfo({
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
                })
                .catch((error: any) => {
                    const err = error.response.data.error;
                    reject(err);
                })
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
                    'Trace-ID': convertInfo.traceId,
                    'User': isDeeplink.current ? 'deeplink' : user.current,
                }
            }
        )
            .then((response: any) => {
                setShowModal(false);
            })
            .catch((error: any) => {
                console.error("offeresult error:", error);

                const err = error.response.data.error;
                if (err.code === 'NOT_FOUND' || err.code === 'NO_RESPONSE') {
                    dispatch(setErrorMsg(err.details.td));
                } else {
                    dispatch(setErrorMsg(err.message));
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
                    <div>{errorMsg} {!errorState.DB && `(Trace ID: ${convertInfo.traceId})`}</div>
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
