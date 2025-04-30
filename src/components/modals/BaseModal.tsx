import { Modal, Button } from "react-bootstrap";
import { ReactNode } from "react";

interface IProps {
    isShow: boolean;
    onSave?: () => void;
    onCancel?: () => void;
    title: string;
    saveLabel?: string;
    cancelLabel?: string;
    children?: ReactNode;
}

function BaseModal({
    isShow,
    onSave,
    onCancel,
    title = "Modal heading",
    saveLabel = "Save",
    cancelLabel = "Cancel",
    children
}: IProps) {
    return (
        <Modal
            show={isShow}
            onHide={onCancel}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="rounded-4 f-saraban base-modal"
        >
            <Modal.Header closeButton className="px-5">
                <Modal.Title id="contained-modal-title-vcenter" className="fs-5">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-5">
                {children}
            </Modal.Body>
            <Modal.Footer className="px-5">
                <Button onClick={onCancel} variant="secondary">{cancelLabel}</Button>
                <Button onClick={onSave} className="purple-btn">{saveLabel}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default BaseModal;
