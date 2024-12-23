import { useState, ReactNode } from "react";
import { ToastContainer } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';

import { MessageContext } from "../contexts/MessageContext";

interface MessageProviderProps {
    children: ReactNode;
}

export function MessageProvider({ children }: MessageProviderProps) {

    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [severity, setSeverity] = useState<'SUCCESS' | 'ERROR'>('SUCCESS');
    const [headerMessage, setHeaderMessage] = useState<string>('');
    const [bodyMessage, setBodyMessage] = useState<string>('');

    const bgClasses = {
        'SUCCESS': 'bg-success text-white',
        'ERROR': 'bg-danger text-white'
    }

    return (
        <MessageContext.Provider value={{
            openMessage,
            setOpenMessage,
            severity,
            setSeverity,
            headerMessage,
            setHeaderMessage,
            bodyMessage,
            setBodyMessage
        }}>
            {children}
            <ToastContainer
                className="p-3"
                position="bottom-end"
                style={{ zIndex: 1 }}
            >
                <Toast onClose={() => setOpenMessage(false)} show={openMessage} delay={3000} autohide className={bgClasses[severity]}>
                    <Toast.Header closeButton className={bgClasses[severity]}>
                        <strong className="me-auto">{headerMessage}</strong>
                    </Toast.Header>
                    <Toast.Body>{bodyMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </MessageContext.Provider>
    )
}
