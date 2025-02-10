import { useState } from "react";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import { useAssistant } from "../../hooks/useAssistant";
import { useForm } from "../../hooks/useForm";

interface MessageType {
    index: number;
    type: 'user' | 'assistant';
    response: string;
}

export function ChatWithAssistant() {
    const { chat, messages, splitMessage } = useAssistant();
    const { formData, reset, handleChange } = useForm({
        defaultData: { input: "" },
        rules: { input: { required: true } }
    });

    const [show, setShow] = useState<boolean>(false);
    const [thinkVisible, setThinkVisible] = useState<Record<number, boolean>>({});

    const handleSend = () => {
        if (formData.input.trim()) {
            chat(formData.input);
            reset();
        }
    };

    const toggleThinkVisibility = (index: number) => {
        setThinkVisible(prev => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <>
            <div className="position-absolute bottom-0 end-0 p-3">
                <Button variant="primary" onClick={() => setShow(true)}>
                    Chat
                </Button>
            </div>
            <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Asistente</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column">
                    <ListGroup className="mb-3 overflow-auto" style={{ maxHeight: "300px" }}>
                        {messages.map((msg: MessageType) => {
                            const { thinkContent, restOfText } = splitMessage(msg.response);
                            return (
                                <ListGroup.Item key={msg.index} className={`${msg.type !== 'user' ? "" : "text-end"} d-flex flex-column`}>
                                    {thinkContent && thinkContent.length > 0 && (
                                        <>
                                            <Button 
                                                variant="link" 
                                                size="sm" 
                                                className="text-start p-0"
                                                onClick={() => toggleThinkVisibility(msg.index)}
                                            >
                                                {thinkVisible[msg.index] ? "Ocultar pensamiento" : "Mostrar pensamiento"}
                                            </Button>
                                            {thinkVisible[msg.index] && (
                                                <div className="bg-light p-3 rounded">
                                                    <small>{thinkContent}</small>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <strong>{msg.type !== 'user' ? "Asistente" : "Tú"}</strong> {restOfText}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                    <Form className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder="Escribe un mensaje..."
                            value={formData.input}
                            name="input"
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSend())}
                        />
                        <Button variant="primary" onClick={handleSend} className="ms-2">
                            Enviar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
