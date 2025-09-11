type Part =
    | { type: "text"; text: string; state?: string }
    | { type: "step-start" };

export type Message = {
    id: string;
    role: "user" | "assistant";
    parts: Part[];
};

export interface SendMessageParams {
    text: string;
}

export type ChatStatus = "ready" | "submitted" | "streaming";

export interface VillainState {
   currentIndex: number;
   defeatCounter:number;
}
