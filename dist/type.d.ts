export declare enum ModelVersion {
    V1_5 = "V1_5",
    V2 = "V2",
    V3 = "V3",
    V3_5 = "V3_5"
}
export declare const ModelVersionUrl: {
    V1_5: string;
    V2: string;
    V3: string;
    V3_5: string;
};
export declare const ChatDomain: {
    V1_5: string;
    V2: string;
    V3: string;
    V3_5: string;
};
export declare enum MessageRole {
    user = "user",
    assistant = "assistant"
}
export interface IChatMessage {
    role: MessageRole;
    content: string;
}
export interface IChatResponse {
    text: string;
    uasge: IChatUasgeResponse;
}
interface IChatUasgeResponse {
    completion_tokens: number;
    prompt_tokens: number;
    question_tokens: number;
    total_tokens: number;
}
export interface ISparkChatResponse {
    header: {
        code: number;
        message: string;
        sid: string;
        status: number;
    };
    payload: {
        choices: {
            status: number;
            seq: number;
            text: [
                {
                    content: string;
                    role: string;
                    index: number;
                }
            ];
        };
        usage?: {
            text: IChatUasgeResponse;
        };
    };
}
export {};
