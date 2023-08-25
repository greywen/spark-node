export class ChatRequestParametes {
  constructor(
    public temperature: number = 0.5,
    public max_tokens: number = 2048,
    public top_k: number = 4,
    public chat_id: string = null
  ) {}
}
