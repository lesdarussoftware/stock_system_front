import { useState } from "react";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import { useAssistant } from "../../hooks/useAssistant";
import { useForm } from "../../hooks/useForm";

export function ChatWithAssistant() {

    const { chat, messages } = useAssistant();

    const { formData, reset, handleChange } = useForm({
        defaultData: { input: "" },
        rules: { input: { required: true } }
    });

    const [show, setShow] = useState(false);

    const handleSend = () => {
        if (formData.input.trim()) {
            chat(formData.input);
            reset();
        }
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
                        {messages.map((msg, index) => {
                            return (
                                <ListGroup.Item key={index} className={msg.type !== 'user' ? "" : "text-end"}>
                                    <strong>{msg.type !== 'user' ? "Asistente" : "Tú"}:</strong> {msg.response}
                                </ListGroup.Item>
                            )
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
