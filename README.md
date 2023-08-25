**[English](README_EN.md)** | **简体中文**

`gy-spark-node`是一个非官方的开源项目，提供 SparkDesk WebSocket API (https://console.xfyun.cn/services/cbm) 的 Nodejs SDK。现在已支持 ModelVersion，用户可以选择包括 V2 模型在内的各种版本模型。上游文档地址：https://www.xfyun.cn/doc/spark/Guide.html

这个项目可以用来开发能够用自然语言与用户交流的聊天机器人和虚拟助手。

## 功能

- 为 SparkDesk WebSocket API 的 Nodejs SDK
- 支持同步和异步通信。
- 实现了流 API，以实现实时通信。
- 为聊天机器人开发提供了简单直观的 API。
- 支持 ModelVersion，允许用户在不同版本的模型中选择。

## 安装

```
npm install gy-node-spark
```

## 使用方法

```typescript
SparkClient client = new SparkClient(appId, apiKey, apiSecret);
```

### 示例 1：使用流 API 和回调与虚拟助手聊天

以下示例显示了如何使用 `ChatAsync` 方法与虚拟助手聊天：

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

### 示例 2：使用流 API 与虚拟助手聊天（V2 模型）

以下示例显示了如何使用 `ChatAsStreamAsync` 方法和 V2 模型以及流 API 与虚拟助手聊天：

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

### 示例 3：中断流 API 与虚拟助手聊天

以下示例显示了如何使用 `ChatAsStreamAsync` 方法和 V2 模型以及流 API 与虚拟助手聊天：

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

## 许可证

gy-node-spark 遵循 MIT 许可证。 请参阅[LICENSE.txt](LICENSE.txt)文件以获取更多信息。
