import React from "react";
import { Row, Col } from "react-bootstrap";

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
    suggestCards: any[];
    // card 10
    suggestPromotions: any[]
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
    suggestPromotions: []
}

const C360Tabs: React.FC = () => {
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
