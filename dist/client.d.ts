import { IChatMessage, IChatResponse, ModelVersion } from "./type";
import { ChatRequestParametes } from "./chatRequestParametes";
export declare class SparkClient {
    private appId;
    private apiKey;
    private apiSecret;
    constructor(appId: string, apiKey: string, apiSecret: string);
    getAuthorizationUrl(model?: ModelVersion): string;
    /**
     * 异步聊天方法，使用回调来处理聊天响应。
     * Asynchronous chat method that uses a callback to handle chat responses.
     *
     * @param model 模型的版本，例如“V1_5”或“V2”。
     * @param model The version of the model, e.g., "V1_5" or "V2".
     *
     * @param messages 一组聊天信息，由用户和助手的消息组成。
     * @param messages A set of chat messages, consisting of messages from the user and assistant.
     *
     * @param callback 用来处理每一个接收到的聊天响应的回调函数。
     * @param callback The callback to process each received chat response.
     *
     * @param parameters 请求的附加参数(可选)。
     * @param parameters Optional additional request parameters.
     *
     * @param uid 用户的唯一标识符(可选)。
     * @param uid User's unique identifier (optional).
     *
     * @param abortController 可选的AbortController实例，用来取消这个请求。
     * @param abortController Optional AbortController instance used to abort this request.
     *
     */
    chatAsync(model: ModelVersion, messages: IChatMessage[], callback: (result: IChatResponse) => void, parameters?: ChatRequestParametes, uid?: string, abortController?: AbortController): Promise<void>;
    /**
     * 异步实时聊天流方法。
     * Asynchronous real-time chat stream method.
     *
     * @param model 模型的版本，例如“V1_5”或“V2”。
     * @param model The version of the model, e.g., "V1_5" or "V2".
     *
     * @param messages 一组聊天信息，由用户和助手的消息组成。
     * @param messages A set of chat messages, consisting of messages from the user and assistant.
     *
     * @param parameters 请求的附加参数(可选)。
     * @param parameters Optional additional request parameters.
     *
     * @param uid 用户的唯一标识符(可选)。
     * @param uid User's unique identifier (optional).
     *
     * @param abortController 可选的AbortController实例，用来取消这个请求。
     * @param abortController Optional AbortController instance used to abort this request.
     *
     * @return 返回一个Generator，它生成的Promise解析为聊天响应。
     * @return Returns a Generator that yields a Promise that resolves to a chat response.
     *
     */
    chatAsStreamAsync(model: ModelVersion, messages: IChatMessage[], parameters?: ChatRequestParametes, uid?: string, abortController?: AbortController): Generator<Promise<IChatResponse>>;
}
