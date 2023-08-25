export default function createWebSocket(url): WebSocket {
  if (
    typeof window !== "undefined" &&
    typeof window.WebSocket !== "undefined"
  ) {
    return new window.WebSocket(url);
  } else if (typeof global !== "undefined") {
    const WebSocket = require("ws");
    return new WebSocket(url);
  } else {
    throw new Error("Not supported WebSocket");
  }
}
