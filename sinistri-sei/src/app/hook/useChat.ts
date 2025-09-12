import { useEffect, useState } from "react";
import { ChatStatus, Message, SendMessageParams, VillainState } from "../types/useChatTypes/useChat";
import { VillainArray } from "../../../lib/Villain";

function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<ChatStatus>("ready");
    const [villainState, setVillainState] = useState<VillainState>({ currentIndex: 0, defeatCounter: 0 });

    useEffect(() => {
        const storedMessages = localStorage.getItem("messages");
        const storedVillainState = localStorage.getItem("villainState");

        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }

        if (storedVillainState) {
            setVillainState(JSON.parse(storedVillainState));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem("villainState", JSON.stringify(villainState));
    }, [villainState]);

    useEffect(() => {
        const fullCycleFinished =
        villainState.currentIndex === 0 &&
        villainState.defeatCounter !== 0 &&
        villainState.defeatCounter % VillainArray.length === 0;
        if (fullCycleFinished) {
            localStorage.removeItem("messages");
            setMessages([]);        }
    }, [villainState.currentIndex, villainState.defeatCounter]);

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
                body: JSON.stringify({ messages: [...messages, userMessage], villainState }),
            });

            if (response.ok) {
                setStatus("streaming");
                const data: { messages: Message[]; villainState: VillainState } = await response.json();

                setMessages(prev => [...prev, ...data.messages]);
                setVillainState(data.villainState);
            }
        } catch (err) {
            console.error("Errore nella chiamata API", err);
        } finally {
            setStatus("ready");
        }
    };

    return { messages, status, villainState, sendMessage };
}

export default useChat;
