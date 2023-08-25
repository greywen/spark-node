import CryptoJS from "crypto-js";

import {
  ChatDomain,
  IChatMessage,
  IChatResponse,
  ISparkChatResponse,
  ModelVersion,
  ModelVersionUrl,
} from "./type";
import { ChatRequestParametes } from "./chatRequestParametes";
import createWebSocket from "./createWebSocket";

export class SparkClient {
  private appId: string;
  private apiKey: string;
  private apiSecret: string;

  constructor(appId: string, apiKey: string, apiSecret: string) {
    this.appId = appId;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  getAuthorizationUrl(model = ModelVersion.V1_5) {
    const url = new URL(ModelVersionUrl[model]);
    const host = url.host;
    const date = new Date().toUTCString();
    const algorithm = "hmac-sha256";
    const headers = "host date request-line";
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${url.pathname} HTTP/1.1`;
    const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.apiSecret);
    const signature = CryptoJS.enc.Base64.stringify(signatureSha);
    const authorizationOrigin = `api_key="${this.apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
    const authorization = btoa(authorizationOrigin);
    return `${url}?authorization=${authorization}&date=${date}&host=${host}`;
  }

  // chatAsStream(
  //   model: ModelVersion = ModelVersion.V1_5,
  //   messages: IChatMessage[],
  //   parameters?: ChatRequestParametes,
  //   uid?: string
  // ) {
  //   let params = {
  //     header: {
  //       app_id: this.appId,
  //       uid: uid,
  //     },
  //     parameter: {
  //       chat: {
  //         domain: ChatDomain[model],
  //         ...parameters,
  //       },
  //     },
  //     payload: {
  //       message: {
  //         text: messages,
  //       },
  //     },
  //   };

  //   const url = this.getAuthorizationUrl(model);
  //   let ws = createWebSocket(url);

  //   const stream = new ReadableStream<IChatResponse>({
  //     start(controller) {
  //       ws.onmessage = (event) => {
  //         function close() {
  //           ws.close();
  //           controller.close();
  //         }

  //         const resp = JSON.parse(event.data) as ISparkChatResponse;
  //         if (resp.header.code !== 0) {
  //           throw new Error(
  //             `code: ${resp.header.code}, sid: ${resp.header.sid}, message: ${resp.header.message}`
  //           );
  //         }

  //         const text = resp.payload.choices.text
  //           .map((t) => t.content)
  //           .join(" ");
  //         const result = {
  //           text,
  //           uasge: resp.payload.usage?.text || null,
  //         };

  //         controller.enqueue(result);

  //         if (resp.header.status === 2) {
  //           close();
  //         }
  //       };

  //       ws.onopen = () => {
  //         ws.send(JSON.stringify(params));
  //       };

  //       ws.onerror = (event) => {
  //         throw new Error(JSON.stringify(event));
  //       };
  //     },
  //   });
  //   return stream;
  // }

  // async chatAsync(
  //   model: ModelVersion = ModelVersion.V1_5,
  //   messages: IChatMessage[],
  //   callback: (result: IChatResponse) => void,
  //   parameters?: ChatRequestParametes,
  //   uid?: string
  // ) {
  //   const stream = this.chatAsStream(model, messages, parameters, uid);
  //   const reader = await stream.getReader();
  //   while (true) {
  //     const { done, value } = await reader.read();
  //     if (done) {
  //       break;
  //     }
  //     callback(value);
  //   }
  // }

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

  async chatAsync(
    model: ModelVersion = ModelVersion.V1_5,
    messages: IChatMessage[],
    callback: (result: IChatResponse) => void,
    parameters?: ChatRequestParametes,
    uid?: string,
    abortController?: AbortController
  ) {
    const generator = await this.chatAsStreamAsync(
      model,
      messages,
      parameters,
      uid,
      abortController
    );
    for await (const message of generator) {
      callback(message);
    }
  }

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

  *chatAsStreamAsync(
    model: ModelVersion = ModelVersion.V1_5,
    messages: IChatMessage[],
    parameters?: ChatRequestParametes,
    uid?: string,
    abortController?: AbortController
  ): Generator<Promise<IChatResponse>> {
    let params = {
      header: {
        app_id: this.appId,
        uid: uid,
      },
      parameter: {
        chat: {
          domain: ChatDomain[model],
          ...parameters,
        },
      },
      payload: {
        message: {
          text: messages,
        },
      },
    };

    const url = this.getAuthorizationUrl(model);
    let ws = createWebSocket(url);
    ws.onopen = () => {
      ws.send(JSON.stringify(params));
    };

    let end = false;

    do {
      const waitForMessage: Promise<IChatResponse> = new Promise((resolve) => {
        ws.onmessage = (event) => {
          function close() {
            ws.close();
          }

          const resp = JSON.parse(event.data) as ISparkChatResponse;
          if (resp.header.code !== 0) {
            throw new Error(
              `code: ${resp.header.code}, sid: ${resp.header.sid}, message: ${resp.header.message}`
            );
          }

          const text = resp.payload.choices.text
            .map((t) => t.content)
            .join(" ");
          const result = {
            text,
            uasge: resp.payload.usage?.text || null,
          };

          resolve(result);
          if (resp.header.status === 2) {
            close();
            end = true;
          }
        };
      });
      yield waitForMessage;
    } while (!abortController?.signal.aborted && !end);

    if (ws.readyState === 1) {
      ws.close();
    }
  }
}
