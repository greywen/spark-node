**[简体中文](README.md)** | **English**

`gy-spark-node` is an unofficial open-source project providing the Nodejs SDK for the SparkDesk WebSocket API (https://console.xfyun.cn/services/cbm). It now supports ModelVersion, allowing users to choose from a variety of model versions, including the V2 model. The upstream documentation is available here: https://www.xfyun.cn/doc/spark/Guide.html

This project can be used for developing chatbots and virtual assistants capable of communicating with users in natural language.

## Features

- Provides the Nodejs SDK for the SparkDesk WebSocket API.
- Supports both synchronous and asynchronous communication.
- Implements a streaming API for real-time communication.
- Offers a simple and intuitive API for chatbot development.
- Supports ModelVersion, enabling users to choose from different versions of the model.

## Installation

```
npm install gy-node-spark
```

## Usage

```typescript
SparkClient client = new SparkClient(appId, apiKey, apiSecret);
```

### Example 1: Chatting with a virtual assistant using the streaming API and callbacks

The following example demonstrates how to use the `ChatAsync` method to chat with a virtual assistant:

```typescript
SparkClient client = new SparkClient(AppId, APIKey, APISecret);

const model = ModelVersion.V1_5;
const messages = [ChatMessage.fromUser("中国第一个皇帝是谁？")];

let contents = "";
await client.chatAsync(model, messages, (value) => {
  contents += value.text;
});

console.log(contents);
```

### Example 2: Chatting with a virtual assistant using the streaming API (V2 model)

The following example demonstrates how to use the `ChatAsStreamAsync` method with the V2 model and the streaming API to chat with a virtual assistant:

```typescript
SparkClient client = new SparkClient(AppId, APIKey, APISecret);

const model = ModelVersion.V2;
const messages = [
    ChatMessage.fromUser("1+1=?"),
    ChatMessage.fromAssistant("1+1=3"),
    ChatMessage.fromUser("不对啊，请再想想？"),
];

let contents = "";
const generator = await client.chatAsStreamAsync(model, messages);
for await (const message of generator) {
  contents += message.text;
}

console.log(contents);
```

### Example 3: Interrupting chat with a virtual assistant using the streaming API

The following example demonstrates how to use the `ChatAsStreamAsync` method with the V2 model and the streaming API to chat with a virtual assistant:

```typescript
SparkClient client = new SparkClient(AppId, APIKey, APISecret);
const model = ModelVersion.V2;

const messages = [
    ChatMessage.fromUser(
        "系统提示：你叫张三，一名5岁男孩，你在金色摇篮幼儿园上学，你的妈妈叫李四，是一名工程师"
    ),
    ChatMessage.fromUser("你好小朋友，我是周老师，你在哪上学？"),
];

let content: IChatResponse | null = null;
const abort = new AbortController();
const generator = await client.chatAsStreamAsync(
    model,
    messages,
    undefined,
    "gy",
    abort
);
for await (const message of generator) {
    content = message;
    abort.abort();
}

console.log(content);
```

## License

gy-node-spark is licensed under the MIT License. Please refer to the [LICENSE.txt](LICENSE.txt) file for more information.
