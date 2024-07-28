import { ChatMessageState } from "./ChatMessageState";

export interface ChatMessage {
    role: string,
    content: string,
    state: ChatMessageState
}