/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../contexts/AuthContext"
import { MessageContext } from "../contexts/MessageContext"
import { useQuery } from "./useQuery"

import { LOGIN_URL, LOGOUT_URL } from "../utils/urls"
import { STATUS_CODES } from "../utils/statusCodes"

export function useAuth() {

    const { auth, setAuth, setSessionExpired } = useContext(AuthContext);
    const { setBodyMessage, setHeaderMessage, setSeverity, setOpenMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();

    const navigate = useNavigate();

    async function login(
        e: any,
        credentials: { username: string, password: string },
        validate: () => any,
        reset: () => any
    ) {
        e.preventDefault();
        if (validate()) {
            try {
                const { status, data } = await handleQuery({
                    url: LOGIN_URL,
                    method: 'POST',
                    body: JSON.stringify(credentials)
                })
                if (status !== STATUS_CODES.OK) {
                    setSeverity('ERROR');
                    setHeaderMessage(credentials.username);
                    setBodyMessage('Credenciales inválidas.');
                    setOpenMessage(true);
                } else {
                    reset();
                    setAuth(data);
                    setSessionExpired(false)
                    localStorage.setItem('stock_system_auth', JSON.stringify(data));
                    navigate('/productos');
                }
            } catch {
                setSeverity('ERROR');
                setHeaderMessage(credentials.username);
                setBodyMessage('Ocurrió un error.');
                setOpenMessage(true);
            }
        }
    }

    const handleLogout = () => {
        handleQuery({
            url: LOGOUT_URL,
            method: 'POST',
            token: auth?.refresh_token
        })
        localStorage.removeItem('stock_system_auth')
        setAuth(null)
        navigate('/')
    }

    return { login, handleLogout }
}