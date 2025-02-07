import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useAuth } from "../../hooks/useAuth";

import { ChatWithAssistant } from "./ChatWithAssistant";

type LayoutProps = {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {

    const navigate = useNavigate();

    const { handleLogout } = useAuth();

    return (
        <div style={{ maxWidth: '2000px', margin: 'auto' }}>
            <header>
                <Navbar bg="primary" className="d-flex justify-content-between px-3" expand="lg">
                    <Navbar.Brand className="text-white d-flex align-items-center">
                        Venc.:
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-responsive" className="border-0 bg-white" />
                    <Navbar.Collapse id="navbar-responsive">
                        <Nav className="d-flex flex-column flex-lg-row justify-content-lg-end align-items-lg-center gap-2 w-100 mt-4 mt-lg-0">
                            <Nav.Link className="text-white" onClick={() => navigate('/productos')}>Artículos</Nav.Link>
                            <Nav.Link className="text-white" onClick={() => navigate('/clientes')}>Clientes</Nav.Link>
                            <Nav.Link className="text-white" onClick={() => navigate('/ventas')}>Ventas</Nav.Link>
                            <Nav.Link className="text-white" onClick={() => navigate('/compras')}>Compras</Nav.Link>
                            <Nav.Link className="text-white" onClick={() => navigate('/categorias')}>Categorías</Nav.Link>
                            <Nav.Link className="text-white" onClick={() => navigate('/proveedores')}>Proveedores</Nav.Link>
                            <Nav.Link className="text-white" onClick={() => navigate('/depositos')}>Depósitos</Nav.Link>
                            <Nav.Link className="text-white" onClick={() => navigate('/usuarios')}>Usuarios</Nav.Link>
                            <Nav.Link className="text-white" onClick={handleLogout}>Salir</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
            <main className="container-fluid px-4 py-3">
                {children}
                <ChatWithAssistant />
            </main>
        </div>
    )
}
