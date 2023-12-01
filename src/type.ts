export enum ModelVersion {
  V1_5 = "V1_5",
  V2 = "V2",
  V3 = "V3",
}

export const ModelVersionUrl = {
  [ModelVersion.V1_5]: "wss://spark-api.xf-yun.com/v1.1/chat",
  [ModelVersion.V2]: "wss://spark-api.xf-yun.com/v2.1/chat",
  [ModelVersion.V3]: "wss://spark-api.xf-yun.com/v3.1/chat",
};

export const ChatDomain = {
  [ModelVersion.V1_5]: "general",
  [ModelVersion.V2]: "generalv2",
  [ModelVersion.V3]: "generalv3",
};

export enum MessageRole {
  user = "user",
  assistant = "assistant",
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
