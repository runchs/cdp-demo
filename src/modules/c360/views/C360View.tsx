import React, { useState, useEffect } from "react";

// components
import { Row, Col, Button } from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';

// modals
import BaseModal from "@/components/modals/BaseModal";

enum COfferResult {
    Acknowledged = 'Acknowledged',
    Interested = 'Interested',
    NotInterested = 'Not Interested',
}

interface ICard {
    id: number;
    name: string;
}

interface IPromotion {
    id: number;
    title: string;
    description: string;
    periode: string;
    eligibleCard: string;
    offerResult: COfferResult | null;
}

interface IInfo {
    updateDate: string;
    // card 1
    nameTH: string;
    nameEN: string;
    cdpId: string;
    nationalID: string;
    status: string;
    complaintLevel: number;
    // card 2
    customerGroup: string;
    customerGroupDesc: string;
    complaintGroup: string;
    customerType: string;
    memberStatus: string;
    customerSegment: string;
    // card 3
    phoneNo: string;
    phoneNoDesc: string;
    callingPhone: string;
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
    suggestCards: ICard[];
    // card 10
    suggestPromotions: IPromotion[]
}

const infoMock: IInfo = {
    updateDate: '25 Mar 2025',
    // card 1
    nameTH: 'รัญชิดา เสน่ห์ภักดี',
    nameEN: 'RUNCHIDA SNEPAKDEE',
    cdpId: '',
    nationalID: '1234567890000',
    status: 'Sweetheart',
    complaintLevel: 2,
    // card 2
    customerGroup: 'NORMAL',
    customerGroupDesc: 'VIP Customer',
    complaintGroup: '',
    customerType: 'VP',
    memberStatus: 'NORMAL',
    customerSegment: 'Existing Customer - Active',
    // card 3
    phoneNo: '0812345678',
    phoneNoDesc: 'No update',
    callingPhone: 'value7',
    address: '183 ซ.เจริญนคร 10 ต.คลองต้นไทร อ.คลองสาน จ.กรุงเทพมหานคร 10110',
    gender: 'Male',
    MaritalStatus: 'Single',
    typeOfJob: 'BUSINESS OWNER',
    // card 4
    statementChannel: 'E-statement',
    lastStatementSentDate: '25 Mar 2025',
    statementSentStatus: 'ไม่สำเร็จ (Email ตีกลับ (ชั่วคราว) อาจเกิดจาก email box เต็ม Action: ดำเนินการส่งใหม่ได้)',
    // card 5
    lastIncreaseLimit: '15 Feb 2025',
    lastReduceLimit: 'No Update',
    lastIncome: '15 Feb 2025',
    lastCardApply: '15 Feb 2025',
    // card 6
    consentForCollect: 'Uncensent',
    consentForDisclose: 'Consent',
    blockedMedia: 'No blocked',
    // card 7
    suggestAction: 'No Seggestion',
    // card 8
    paymentStatus: '!Payment Overdue',
    dayPastDue: 89,
    lastOverDueDate: '',
    // card 9
    suggestCards: [
        { id: 1, name: 'Club Thailand JCB Card 1' },
        { id: 2, name: 'Club Thailand JCB Card 2' },
        { id: 3, name: 'Club Thailand JCB Card 3' }
    ],
    // card 10
    suggestPromotions: [
        {
            id: 1,
            title: 'Technology Innovation',
            description: 'Exploring the latest advancements in technology and their impact on our future. Exploring the latest advancements in technology and their impact on our future. Exploring the latest advancements in technology and their impact on our future. Exploring the latest advancements in technology and their impact on our future.',
            periode: '4 Sep 2024 - 30 Sep 2024',
            eligibleCard: 'BIG C WORLD MASTERCARD',
            offerResult: null
        },
        {
            id: 2,
            title: 'Digital Transformation',
            description: 'How businesses are adapting to the digital age and embracing new technologies.',
            periode: '4 Sep 2024 - 30 Sep 2024',
            eligibleCard: 'BIG C WORLD MASTERCARD',
            offerResult: null
        },
        {
            id: 3,
            title: 'Artificial Intelligence',
            description: 'The role of AI in shaping the future of technology and human interaction.',
            periode: '4 Sep 2024 - 30 Sep 2024',
            eligibleCard: 'BIG C WORLD MASTERCARD',
            offerResult: null
        }
    ]
}

const offerResultOptions = [
    { label: "Acknowledged", value: "Acknowledged" },
    { label: "Interested", value: "Interested" },
    { label: "Not Interested", value: "Not Interested" },
];

const C360Tabs: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState<IPromotion | null>(null);


    const suggestCards = () => {
        return (
            <div>
                {infoMock.suggestCards.length > 0 ? (
                    infoMock.suggestCards.map(card => (
                        <div key={card.id}>• {card.name}</div>
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
                <Carousel interval={5000} className="rounded-4 overflow-hidden shadow-sm bg-light">
                    {infoMock.suggestPromotions.map((item) => (
                        <Carousel.Item key={item.id}>
                            <div
                                className="d-flex flex-column promotion-wrp bg-promotion"
                            >
                                <div className="fw-bold fs-5">{item.title}</div>
                                <div className="fs-7">
                                    <div className="desc mt-2 mb-4">{item.description}</div>
                                    <div><span className="fw-bold">Periode:</span> {item.periode}</div>
                                    <div><span className="fw-bold">Eligible Card:</span> {item.eligibleCard}</div>
                                    <Button variant="dark" className="mt-4 fs-7" onClick={() => handleOpenModal(item)}>More Detail</Button>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
                {moreDetailsModal()}
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
                <div>
                    <div className="fs-4 fw-bold mb-3">{selectedPromotion?.title}</div>
                    <div className="bg-promotion p-3 rounded-3 mb-3 fs-7">{selectedPromotion?.description}</div>
                    <Row className="bg-promotion p-3 rounded-3 gx-0 fs-7">
                        <Col xs={4}>
                            <div className="fw-bold mb-2">Eligible Card:</div>
                            <div>{selectedPromotion?.eligibleCard}</div>
                        </Col>
                        <Col xs={4}>
                            <div className="fw-bold mb-2">Periode:</div>
                            <div>{selectedPromotion?.periode}</div>
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
        <div className="py-4 px-5 d-flex flex-column gap-3 bg-color-primary">
            <div className="text-end text-light">CDP data update as of <span className="fw-bold">{infoMock.updateDate}</span></div>
            {/* card 1 */}
            <Row className="rounded-3 bg-light gx-0 p-4">
                <Col xs={9} className="text-start fw-bold">
                    <div className="fs-5">{infoMock.nameTH} {infoMock.cdpId}</div>
                    <div className="fs-5 mb-3">{infoMock.nameEN} {infoMock.cdpId}</div>
                    <div>National ID: <span className="fw-light">{infoMock.nationalID}</span></div>
                </Col>
                <Col xs={3} className="text-start fw-bold text-center">
                    <div className="mb-1">{infoMock.status}</div>
                    <div className="d-inline-block rounded-4 text-light bg-warning px-4 py-2">Complaint Level: {infoMock.complaintLevel}</div>
                </Col>
            </Row>
            {/* card 2 */}
            <div className="rounded-3 bg-light p-4 text-start">
                <Row className="fs-5 fw-bold">
                    <Col xs={4}>Customer Group:</Col>
                    <Col xs={8}>{infoMock.customerGroup}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Complaint Group:</Col>
                    <Col xs={8}>{infoMock.complaintGroup}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Customer Type:</Col>
                    <Col xs={8}>{infoMock.customerType}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Member Status:</Col>
                    <Col xs={8}>{infoMock.memberStatus}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Customer Segment:</Col>
                    <Col xs={8}>{infoMock.customerSegment}</Col>
                </Row>
            </div>
            {/* card 3 */}
            <div className="rounded-3 bg-light p-4 text-start">
                <Row>
                    <Col xs={4} className="fw-bold">Phone No.:</Col>
                    <Col xs={8}>{infoMock.phoneNo}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Calling phone:</Col>
                    <Col xs={8}>{infoMock.callingPhone}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Mail-to-Office:</Col>
                    <Col xs={8}>{infoMock.address}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Gender:</Col>
                    <Col xs={8}>{infoMock.gender}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Marital Status:</Col>
                    <Col xs={8}>{infoMock.MaritalStatus}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Type of Job:</Col>
                    <Col xs={8}>{infoMock.typeOfJob}</Col>
                </Row>
            </div>
            {/* card 4 */}
            <div className="rounded-3 bg-light p-4 text-start">
                <Row>
                    <Col xs={4} className="fw-bold">Statement Channel:</Col>
                    <Col xs={8}>{infoMock.statementChannel}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Last e-statement sent date:</Col>
                    <Col xs={8}>{infoMock.lastStatementSentDate}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">E-statement sent status:</Col>
                    <Col xs={8}>{infoMock.statementSentStatus}</Col>
                </Row>
            </div>
            {/* card 5 */}
            <div className="rounded-3 bg-light p-4 text-start">
                <Row>
                    <Col xs={4} className="fw-bold">Last Increase limit Update:</Col>
                    <Col xs={8}>{infoMock.lastIncreaseLimit}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Last Reduce limit Update:</Col>
                    <Col xs={8}>{infoMock.lastReduceLimit}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Last Income Update:</Col>
                    <Col xs={8}>{infoMock.lastIncome}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Last Card Apply Date:</Col>
                    <Col xs={8}>{infoMock.lastCardApply}</Col>
                </Row>
            </div>
            {/* card 6 */}
            <div className="rounded-3 bg-light p-4 text-start">
                <Row>
                    <Col xs={4} className="fw-bold">Consent for collect & use:</Col>
                    <Col xs={8}>{infoMock.consentForCollect}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Consent for disclose:</Col>
                    <Col xs={8}>{infoMock.consentForDisclose}</Col>
                </Row>
                <Row>
                    <Col xs={4} className="fw-bold">Blocked Media:</Col>
                    <Col xs={8}>{infoMock.blockedMedia}</Col>
                </Row>
            </div>
            {/* card 7 */}
            <div className="rounded-3 p-4 bg-suggest-action">
                <div className="fw-bold fs-5 pb-2">Suggest Action</div>
                <div>{infoMock.suggestAction}</div>
            </div>
            {/* card 8 */}
            <div className="rounded-3 bg-light p-4">
                <div className="fw-bold fs-5 pb-2">Payment Status: <span className="text-success">{infoMock.paymentStatus}</span></div>
                <div className="d-flex justify-content-center">
                    <div className="me-5"><span className="fw-bold me-3">Day Past Due: </span >{infoMock.dayPastDue} days</div>
                    <div className="ms-5"><span className="fw-bold me-3">Last Overdue Date: </span >{infoMock.lastOverDueDate || '-'}</div>
                </div>
            </div>
            {/* card 9, 10 */}
            <Row className=" gx-0">
                {/* card 9*/}
                <Col xs={4} className="rounded-3 bg-light p-4 text-start">
                    <div className="fw-bold fs-5 pb-2">Suggested Cards</div>
                    <div>
                        {suggestCards()}
                    </div>
                </Col>
                {/* card 10 */}
                <Col xs={8} className="bg-color-primary ps-3">
                    <div className="rounded-3 bg-light p-4 text-start">
                        <div className="fw-bold fs-5 pb-2">Suggested Promotions</div>
                        <div>
                            {suggestPromotions()}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>

    );
};

export default C360Tabs;
