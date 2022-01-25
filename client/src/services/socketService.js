import { io } from "socket.io-client";
import store from "@/store/index";

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    const token = store.getters.token;

    this.socket = io(process.env.VUE_APP_SOCKET_URL, {
      query: `token=${token}`,
    });
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketioService();
