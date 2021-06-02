import {
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/notes' })
export class NotesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private notes: any;
  private eventsRoom: 'notes-events';
  constructor() {
    this.notes = Array(3)
      .fill(0)
      .map((i, ix) => ({ message: `message ${ix}`, date: new Date() }));
  }

  handleConnection(client: Socket, ...args: any[]) {
    // Here you can get client token and credentials to join the current connection to the right broadcasting rooms
    // For this example Im going to join the client to a room named notes-events to send general events to the clients

    client.join(this.eventsRoom);
  }

  @SubscribeMessage('get-notes')
  async getNotes(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<WsResponse> {
    this.server.to(this.eventsRoom).emit('notes-count', this.notes.length);

    const result: WsResponse = {
      event: 'get-notes',
      data: this.notes,
    };
    return result;
  }

  @SubscribeMessage('add-note')
  async addNote(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<WsResponse> {
    if (!payload) return;
    this.notes.push({ message: payload, date: new Date() });
    this.server.to(this.eventsRoom).emit('notes-count', this.notes.length);
    const result: WsResponse = {
      event: 'get-notes',
      data: this.notes,
    };
    return result;
  }
}
