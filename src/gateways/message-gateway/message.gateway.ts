import { Logger, OnModuleInit, Req, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Request } from "express";
import { Socket, Server } from "socket.io";
import { WsGuard } from "src/auth/jwt/ws.guard";
import { NewMessageDto } from "./dto/newMessage.dto";

@WebSocketGateway({ cors: true })
export class MessageGateway implements OnModuleInit {
    
    @WebSocketServer()
    private readonly server: Server;
    private readonly logger: Logger = new Logger('MessageGateway');
    
    @SubscribeMessage('newMessage')
    async onSendMessage(@MessageBody() messageDto: NewMessageDto, @ConnectedSocket() socket: Socket, @Req() req: Request) {
        if (!socket.rooms.has(messageDto.roomId)) {
            this.server.to(socket.id).emit('onException', {
                statusCode: 403,
                message: 'Пользователь не состоит в чате'
            });
        }

        this.server.to(messageDto.roomId).emit('onNewMessage', {
            message: messageDto
        });
    }

    onModuleInit() {
        this.server.on('connection', socket => {
            this.logger.log(`Клиент ${socket.id} был подключен`);
        });
    }
}