import { useContext, useState } from "react";

import { AuthContext } from "../contexts/AuthContext";

import { ASSISTANT_URL } from "../utils/urls";

export function useAssistant() {
    const { auth } = useContext(AuthContext);
    const [messages, setMessages] = useState<
        { index: number; type: 'user' | 'assistant'; response: string; }[]
    >([]);
    const [partialResponse, setPartialResponse] = useState("");

    async function chat(prompt: string) {
        const eventSource = new EventSource(`${ASSISTANT_URL}/chat?prompt=${prompt}&token=${auth?.access_token}`);

        setMessages(prev => [...prev, { index: prev.length, type: "user", response: prompt }]);
        setPartialResponse("");

        eventSource.onmessage = ({ data }) => {
            const { done, response } = JSON.parse(data);

            setPartialResponse(prevPartial => {
                const updatedResponse = prevPartial + response;

                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage?.type === "assistant") {
                        return [
                            ...prev.slice(0, -1),
                            { ...lastMessage, response: updatedResponse }
                        ];
                    } else {
                        return [...prev, { index: prev.length, type: "assistant", response: updatedResponse }];
                    }
                });

                return updatedResponse;
            });

            if (done) eventSource.close();
        };

        eventSource.onerror = (error) => {
            console.error("Error:", error);
            eventSource.close();
        };
    }

    function splitMessage(text: string) {
        const match = text.match(/<think>(.*?)<\/think>/s);
        if (match) {
            return {
                thinkContent: match[1].trim(),
                restOfText: text.replace(match[0], "").trim()
            };
        }
        return { thinkContent: null, restOfText: text.trim() };
    }

    return { chat, messages, setMessages, partialResponse, splitMessage };
}
