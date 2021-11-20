import io from "socket.io-client";

const websocketURL = 'https://node-api-exggbigdnq-an.a.run.app'
const roomId = 'healthy'

const socket = io(websocketURL, {
  transports: ["websocket"],
});

export const JoinRoom = (): void => {
  socket.emit("join", roomId);
  return;
};

export interface status {
  id: string;
  name: string;
  status: number;
  url: string;
}

export const SendStatus = (data: status): void => {
  socket.emit("updateStatus", data);
  return;
};

export const SetStatusListener = (
  setCheered: React.Dispatch<React.SetStateAction<number>>
): void => {
  socket.on("cheered", (time: number) => {
    setCheered(time);
    return;
  });
};

export const Disconnect = (): void => {
  socket.disconnect();
  return;
};

export const Connect = (): void => {
  socket.connect();
  return;
};
