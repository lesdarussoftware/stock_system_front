import { createContext } from "react";

export interface AuthData {
    access_token: string;
    refresh_token: string;
    me: {
        id: number;
        username: string;
        deadline: string;
    }
}

interface AuthContextType {
    auth: AuthData | null;
    setAuth: (auth: AuthData | null) => void;
    sessionExpired: boolean;
    setSessionExpired: (sessionExpired: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => { },
    sessionExpired: false,
    setSessionExpired: () => { }
});