import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ASSISTANT_URL } from "../utils/urls";

export function useAssistant() {
    const { auth } = useContext(AuthContext);
    const [messages, setMessages] = useState<
        { model: string; response: string; thought?: string; showThought?: boolean }[]
    >([]);

    async function chat(prompt: string) {
        const eventSource = new EventSource(`${ASSISTANT_URL}/chat?prompt=${prompt}&token=${auth?.access_token}`);

        setMessages(prev => [...prev, { model: "user", response: prompt }]);

        let messageIndex: number;
        setMessages(prev => {
            messageIndex = prev.length;
            return [...prev, { model: "assistant", response: "", thought: "", showThought: false }];
        });

        eventSource.onmessage = ({ data }) => {
            const { done, response } = JSON.parse(data);

            setMessages(prev => {
                const updatedMessages = [...prev];

                if (messageIndex !== undefined) {
                    let thought = updatedMessages[messageIndex].thought || "";
                    let cleanResponse = response;

                    // Extraer el pensamiento si está presente
                    const thinkRegex = /<think>(.*?)<\/think>/s;
                    const match = response.match(thinkRegex);

                    if (match) {
                        thought += match[1]; // Guardar el pensamiento sin etiquetas
                        cleanResponse = response.replace(thinkRegex, "").trim(); // Eliminarlo de la respuesta
                    }

                    updatedMessages[messageIndex] = {
                        ...updatedMessages[messageIndex],
                        response: updatedMessages[messageIndex].response + cleanResponse,
                        thought,
                    };
                }

                return updatedMessages;
            });

            if (done) {
                eventSource.close();
            }
        };

        eventSource.onerror = (error) => {
            console.error("Error:", error);
            eventSource.close();
        };
    }

    function toggleThought(index: number) {
        setMessages(prev =>
            prev.map((msg, i) =>
                i === index ? { ...msg, showThought: !msg.showThought } : msg
            )
        );
    }

    return { chat, messages, setMessages, toggleThought };
}
