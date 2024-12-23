import { useState, ReactNode } from "react";
import Modal from 'react-bootstrap/Modal';

import { AuthContext, AuthData } from "../contexts/AuthContext";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";

import { UserForm } from "../components/entities/UserForm";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

    const { setShowForm, userFormData } = useUsers();
    const { login } = useAuth();

    const [sessionExpired, setSessionExpired] = useState<boolean>(false);
    const [auth, setAuth] = useState<AuthData | null>(
        localStorage.getItem('stock_system_auth') ?
            JSON.parse(localStorage.getItem('stock_system_auth') ?? '{}') : null);

    return (
        <AuthContext.Provider value={{ auth, setAuth, sessionExpired, setSessionExpired }}>
            <Modal show={sessionExpired} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Tu sesión expiró. Inicia sesión nuevamente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UserForm
                        userFormData={userFormData}
                        setShowForm={setShowForm}
                        handleSubmit={e => login(
                            e,
                            {
                                username: userFormData.formData.username,
                                password: userFormData.formData.password
                            },
                            userFormData.validate,
                            userFormData.reset
                        )}
                        forAuth
                    />
                </Modal.Body>
            </Modal>
            {children}
        </AuthContext.Provider>
    );
}
