import { useEffect, useState } from "react";
import { ChatStatus, Message, SendMessageParams, VillainState } from "../types/useChatTypes/useChat";
import { VillainArray } from "../../../lib/Villain";

/**
 * Custom React hook for managing an interactive chat with a "villain state".
 *
 * ### Main Features:
 * - Manages chat messages (`messages`), persisting them in `localStorage`.
 * - Manages the villain state (`villainState`) with current index and defeat counter.
 * - Sends user messages to the `/api/chat` endpoint and updates responses.
 * - Automatically resets the chat after a full villain cycle.
 *
 * ### Returned state:
 * - `messages`: current list of chat messages.
 * - `status`: chat status (`"ready" | "submitted" | "streaming"`).
 * - `villainState`: villain state `{ currentIndex: number; defeatCounter: number }`.
 *
 * ### Available methods:
 * - `sendMessage({ text })`: sends a user message and updates the state.
 * - `setMessages`: setter to override messages (use with caution).
 * - `setVillainState`: setter to override the villain state.
 *
 * @example
 * ```tsx
 * const { messages, status, villainState, sendMessage } = useChat();
 *
 * sendMessage({ text: "Hello villain!" });
 * ```
 *
 * @returns {Object} An object with chat state and helper methods:
 * - `messages`
 * - `status`
 * - `villainState`
 * - `sendMessage`
 * - `setMessages`
 * - `setVillainState`
 */
function useChat() {
    const [status, setStatus] = useState<ChatStatus>("ready");
    const [messages, setMessages] = useState<Message[]>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("messages");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });
    const [villainState, setVillainState] = useState<VillainState>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("villainState");
            return stored ? JSON.parse(stored) : { currentIndex: 0, defeatCounter: 0 };
        }
        return { currentIndex: 0, defeatCounter: 0 };
    });

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
            setMessages([]);
        }
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

    return { messages, status, villainState, sendMessage, setMessages, setVillainState };
}

export default useChat;
