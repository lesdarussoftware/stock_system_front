/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useUsers } from "../../hooks/useUsers";
import { useTdssdifui } from "../../hooks/useTdssdifui";
import { exportDatabaseToJSONFile } from "../../utils/helpers";
import { useContext } from "react";
import { MessageContext } from "../../contexts/MessageContext";

type LayoutProps = {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {

    const { setOpenMessage, setBodyMessage, setHeaderMessage, setSeverity } = useContext(MessageContext)

    const navigate = useNavigate();

    const { yoiuyiyyuiy, xcxvxcv, setXcxvxcv, handleIuudsfysdu } = useTdssdifui();
    const { logout } = useUsers();

    const handleExport = async () => {
        const { severity, bodyMessage, headerMessage } = await exportDatabaseToJSONFile();
        setSeverity(severity);
        setHeaderMessage(headerMessage);
        setBodyMessage(bodyMessage);
        setOpenMessage(true);
    }

    if (!yoiuyiyyuiy) return (
        <div className="vh-100 w-50 mx-auto d-flex align-items-center justify-content-center">
            <Form onChange={(e: any) => setXcxvxcv(e.target.value)} onSubmit={handleIuudsfysdu} className="w-100 d-flex gap-2">
                <Form.Control name='name' value={xcxvxcv} placeholder="Código..." />
                <Button variant="primary" type="submit">
                    Activar
                </Button>
            </Form>
        </div>
    )

    return (
        <div>
            <header>
                <Navbar bg="primary">
                    <Nav className="d-flex justify-content-end gap-3 w-100 px-3">
                        <Nav.Link className="text-white" onClick={() => navigate('/productos')}>Artículos</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/clientes')}>Clientes</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/ventas')}>Ventas</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/compras')}>Compras</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/categorias')}>Categorías</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/proveedores')}>Proveedores</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/depositos')}>Depósitos</Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate('/usuarios')}>Usuarios</Nav.Link>
                        <Nav.Link className="text-white" onClick={handleExport}>Exportar</Nav.Link>
                        <Nav.Link className="text-white" onClick={logout}>Salir</Nav.Link>
                    </Nav>
                </Navbar>
            </header>
            <main className="mx-5 my-3">
                {children}
            </main>
        </div>
    )
}