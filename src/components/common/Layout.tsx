import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { AuthContext } from "../../contexts/AuthContext";
import { useAuth } from "../../hooks/useAuth";

type LayoutProps = {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {

    const { auth } = useContext(AuthContext);

    const navigate = useNavigate();

    const { handleLogout } = useAuth();

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
                        <Nav.Link className="text-white">Venc.: {auth?.me.deadline}</Nav.Link>
                        <Nav.Link className="text-white" onClick={handleLogout}>Salir</Nav.Link>
                    </Nav>
                </Navbar>
            </header>
            <main className="mx-5 my-3">
                {children}
            </main>
        </div>
    )
}