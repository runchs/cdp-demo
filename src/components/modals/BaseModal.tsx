import { Modal, Button } from "react-bootstrap";
import { ReactNode } from "react";

interface IProps {
    isShow: boolean;
    onSave?: () => void;
    onCancle?: () => void;
    title: string;
    saveLabel?: string;
    cancleLabel?: string;
    children?: ReactNode;
}

function BaseModal({
    isShow,
    onSave,
    onCancle,
    title = "Modal heading",
    saveLabel = "Save",
    cancleLabel = "Cancle",
    children
}: IProps) {
    return (
        <Modal
            show={isShow}
            onHide={onCancle}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="rounded-4 f-saraban"
        >
            <Modal.Header closeButton className="px-5">
                <Modal.Title id="contained-modal-title-vcenter" className="fs-5">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-5">
                {children}
            </Modal.Body>
            <Modal.Footer className="px-5">
                <Button onClick={onCancle} variant="secondary">{cancleLabel}</Button>
                <Button onClick={onSave} className="purple-btn">{saveLabel}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default BaseModal;
