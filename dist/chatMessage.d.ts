import { MessageRole } from "./type";
export declare class ChatMessage {
    static fromUser(content: string): {
        role: MessageRole;
        content: string;
    };
    static fromAssistant(content: string): {
        role: MessageRole;
        content: string;
    };
}
