import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useLoader } from '@/contexts/LoaderContext';

const Loader: React.FC = () => {
    const { isLoading } = useLoader();

    return (
        <Modal
            show={isLoading}
            centered
            backdrop="static" 
            keyboard={false}  
            animation={false}  
            className="loader-modal"
        >
            <Modal.Body className="text-center">
                <Spinner
                    as="span"
                    animation="border"
                    variant="light"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
                <div className="mt-2 f-saraban text-light">Loading...</div>
            </Modal.Body>
        </Modal>
    );
}

export default Loader;
