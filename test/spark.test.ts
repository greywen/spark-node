import { ModelVersion, SparkClient, ChatMessage } from "gy-spark-node";
import { IChatResponse } from "../dist/type";

describe("spark test", () => {
  const AppId = "";
  const APIKey = "";
  const APISecret = "";

  let client: SparkClient;
  beforeAll(() => {
    client = new SparkClient(AppId, APIKey, APISecret);
  });

  test("Use model V1.5 callback", async () => {
    const model = ModelVersion.V1_5;
    const messages = [ChatMessage.fromUser("中国第一个皇帝是谁？")];
    let contents = "";
    await client.chatAsync(model, messages, (value) => {
      contents += value.text;
    });
    expect(contents).toContain("秦始皇");
  });

  test("Use callback", async () => {
    const model = ModelVersion.V1_5;
    const messages = [
      ChatMessage.fromUser(
        "系统提示：你叫张三，一名5岁男孩，你在金色摇篮幼儿园上学，你的妈妈叫李四，是一名工程师"
      ),
      ChatMessage.fromUser("你好小朋友，我是周老师，你在哪上学？"),
    ];
    let contents = "";
    await client.chatAsync(model, messages, (value) => {
      contents += value.text;
    });
    expect(contents).toContain("金色摇篮幼儿园");
  });

  test("Use model V2 stream", async () => {
    const model = ModelVersion.V2;
    const messages = [
      ChatMessage.fromUser("1+1=?"),
      ChatMessage.fromAssistant("1+1=3"),
      ChatMessage.fromUser("不对啊，请再想想？"),
    ];
    let contents = "";
    const generator = client.chatAsStreamAsync(model, messages);
    for await (const message of generator) {
      contents += message.text;
    }
    expect(contents).toContain("2");
  });

  test("Use model V1.5 stream", async () => {
    const model = ModelVersion.V1_5;
    const messages = [
      ChatMessage.fromUser(
        "系统提示：你叫张三，一名5岁男孩，你在金色摇篮幼儿园上学，你的妈妈叫李四，是一名工程师"
      ),
      ChatMessage.fromUser("你好小朋友，我是周老师，你在哪上学？"),
    ];
    let contents = "";
    const generator = await client.chatAsStreamAsync(model, messages);
    for await (const message of generator) {
      contents += message.text;
    }
    expect(contents).toContain("金色摇篮幼儿园");
  });

  test("Cancel chat", async () => {
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

    expect(content?.uasge).toBe(null);
  });
});
