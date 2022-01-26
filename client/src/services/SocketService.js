import { io } from "socket.io-client";
import store from "@/store/index";

class SocketService {
  socket;
  constructor() {}

  getSocket() {
    return this.socket;
  }
  setupSocketConnection() {
    const token = store.getters.token;

    this.socket = io(process.env.VUE_APP_SOCKET_URL, {
      query: `auth_token=${token}`,
    });
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();
