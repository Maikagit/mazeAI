import { io, Socket } from 'socket.io-client';
import { MazeUpdate, GameStateUpdate } from '../types/maze';

class SocketService {
  private socket: Socket | null = null;
  private callbacks: { [key: string]: Function[] } = {};

  connect() {
    if (this.socket) return;

    this.socket = io('https://maze-server.example.com', {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('gameStateUpdate', (update: GameStateUpdate) => {
      this.emit('gameStateUpdate', update);
    });

    this.socket.on('playerMove', (update: MazeUpdate) => {
      this.emit('playerMove', update);
    });
  }

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  private emit(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  sendMove(update: MazeUpdate) {
    if (!this.socket) return;
    this.socket.emit('playerMove', update);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();