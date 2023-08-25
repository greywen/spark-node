import { MessageRole } from "./type";

export class ChatMessage {
  public static fromUser(content: string) {
    return {
      role: MessageRole.user,
      content,
    };
  }

  public static fromAssistant(content: string) {
    return {
      role: MessageRole.assistant,
      content,
    };
  }
}
