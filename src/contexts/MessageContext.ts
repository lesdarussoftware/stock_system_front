import { createContext, Dispatch, SetStateAction } from "react";

type MessageContextType = {
    openMessage: boolean;
    setOpenMessage: Dispatch<SetStateAction<boolean>>;
    severity: 'SUCCESS' | 'ERROR';
    setSeverity: Dispatch<SetStateAction<'SUCCESS' | 'ERROR'>>;
    headerMessage: string;
    setHeaderMessage: Dispatch<SetStateAction<string>>;
    bodyMessage: string;
    setBodyMessage: Dispatch<SetStateAction<string>>;
}

export const MessageContext = createContext<MessageContextType>({
    openMessage: false,
    setOpenMessage: () => { },
    severity: 'SUCCESS',
    setSeverity: () => { },
    headerMessage: '',
    setHeaderMessage: () => { },
    bodyMessage: '',
    setBodyMessage: () => { }
})