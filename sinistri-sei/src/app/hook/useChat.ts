import { useState } from "react";
import { ChatStatus, Message, SendMessageParams } from "../types/useChatTypes/useChat";

function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<ChatStatus>("ready");
    const [villainIndex, setVillainIndex] = useState<number>(0);

    const sendMessage = async ({ text }: SendMessageParams) => {
        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            parts: [{ type: "text", text }],
        };

        setMessages(prev => [...prev, userMessage]);
        setStatus("submitted");

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (response.ok) {
                setStatus("streaming");
                const data: { messages: Message[]; index: number } = await response.json();

                setMessages(prev => [...prev, ...data.messages]);
                setVillainIndex(data.index);
            }
        } catch (err) {
            console.error("Errore nella chiamata API", err);
        } finally {
            setStatus("ready");
        }
    };


    return { messages, status, villainIndex, sendMessage };
}

export default useChat;
