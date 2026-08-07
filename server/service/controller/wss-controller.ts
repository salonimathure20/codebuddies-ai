import WebSocket, { Server as WebSocketServer } from "ws";

interface MessageBody {
  channelName: string;
  userName: string;
  sdp?: string;
  candidate?: string;
  code?: any;
}

interface ParsedMessage {
  type: string;
  body: MessageBody;
}

interface Channels {
  [channelName: string]: {
    [userName: string]: WebSocket | null;
  };
}

const channels: Channels = {};

// Initialize WebSocket server
const init = (port: number): void => {
  console.log("Websocket server initiated");
  const wss = new WebSocketServer({ port });

  wss.on("connection", (socket: WebSocket) => {
    console.log("A client has been connected!");

    socket.on("error", console.error);
    socket.on("message", (message: WebSocket.RawData) =>
      onMessage(wss, socket, message)
    );
    socket.on("close", (message: string) => onClose(wss, socket, message));
  });
};

// Send a message to a WebSocket client
const send = (wsClient: WebSocket, type: string, body: unknown): void => {
  wsClient.send(JSON.stringify({ type, body }));
};

// Handle incoming messages
const onMessage = (
  wss: WebSocketServer,
  socket: WebSocket,
  message: WebSocket.RawData
): void => {
  try {
    const parsedMessage: ParsedMessage = JSON.parse(message.toString());
    const { type, body } = parsedMessage;
    const { channelName, userName } = body;

    switch (type) {
      case "join": {
        console.log("A user has joined");
        if (!channels[channelName]) {
          channels[channelName] = {};
        }
        channels[channelName][userName] = socket;
        const userNames = Object.keys(channels[channelName]);
        send(socket, "joined", userNames);
        break;
      }
      case "quit": {
        if (channels[channelName]) {
          channels[channelName][userName] = null;
          const userNames = Object.keys(channels[channelName]);
          if (!userNames.length) {
            delete channels[channelName];
          }
        }
        break;
      }
      case "send_offer": {
        console.log("send_offer event received");
        const { sdp } = body;
        const userNames = Object.keys(channels[channelName]);
        userNames.forEach((uName) => {
          if (uName !== userName) {
            const wsClient = channels[channelName][uName];
            if (wsClient) {
              send(wsClient, "offer_sdp_received", sdp);
            }
          }
        });
        break;
      }
      case "send_answer": {
        const { sdp } = body;
        const userNames = Object.keys(channels[channelName]);
        userNames.forEach((uName) => {
          if (uName !== userName) {
            const wsClient = channels[channelName][uName];
            if (wsClient) {
              send(wsClient, "answer_sdp_received", sdp);
            }
          }
        });
        break;
      }
      case "send_ice_candidate": {
        const { candidate } = body;
        const userNames = Object.keys(channels[channelName]);
        userNames.forEach((uName) => {
          if (uName !== userName) {
            const wsClient = channels[channelName][uName];
            if (wsClient) {
              send(wsClient, "ice_candidate_received", candidate);
            }
          }
        });
        break;
      }
      case "code_update": {
        const { code } = body;

        // Broadcast the code update to other peers
        const userNames = Object.keys(channels[channelName]);
        userNames.forEach((uName) => {
          if (uName !== userName) {
            const wsClient = channels[channelName][uName];
            if (wsClient) {
              send(wsClient, "code_update", { code });
            }
          }
        });
        break;
      }
      default:
        console.warn(`Unknown message type: ${type}`);
        break;
    }
  } catch (error) {
    console.error("Error handling message:", error);
  }
};

// Handle WebSocket disconnection
const onClose = (
  wss: WebSocketServer,
  socket: WebSocket,
  message: string
): void => {
  console.log("onClose", message);
  Object.keys(channels).forEach((cname) => {
    Object.keys(channels[cname]).forEach((uid) => {
      if (channels[cname][uid] === socket) {
        delete channels[cname][uid];
      }
    });
  });
};

// Export the init function
export { init };
