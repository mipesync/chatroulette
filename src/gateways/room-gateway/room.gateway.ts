import { OnModuleInit, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { WsGuard } from "src/auth/jwt/ws.guard";
import { RoomGatewayService } from "./room.gateway.service";
import { FindNewRoomDto } from "./dto/findNewRoom.dto";
import { UserService } from "src/user/user.service";
import { User } from "src/user/schemas/user.schema";
import { LeaveRoomDto } from "./dto/leaveRoom.dto";

@UseGuards(WsGuard)
@WebSocketGateway()
export class RoomGateway implements OnModuleInit/*, OnGatewayConnection, */, OnGatewayDisconnect {
    constructor(private readonly gatewayService: RoomGatewayService,
        private readonly userService: UserService) {}

    @WebSocketServer()
    private server: Server;

    queue: {
        socketId: string;
        userId: string;
        gender: string;
        country: number;
        isBusy: boolean;
    }[] = [];

    handleDisconnect(@ConnectedSocket() socket: Socket) {        
        let queue = this.queue.find(queue => queue.socketId === socket.id);
        if (queue) {
            var index = this.queue.indexOf(queue);
            if (index !== -1) {
                this.queue.splice(index, 1);
            }
        }    
    }

    @SubscribeMessage('joinToQueue')
    async joinToQueue(@MessageBody() { userId }: { userId: string }, @ConnectedSocket() socket: Socket) {
        let user = await this.userService.getUserById(userId).catch((e) => {
            this.server.to(socket.id).emit('onException', {
                statusCode: e.status,
                message: e.message
            });

            stop();
        }) as User;

        this.queue.push({
            socketId: socket.id,
            userId: userId,
            gender: user.gender,
            country: user.country,
            isBusy: false
        });
    }

    @SubscribeMessage('findRoom')
    async findNewRoom(@MessageBody() dto: FindNewRoomDto, @ConnectedSocket() socket: Socket) {
        let partnerQueue = this.queue.find(queue => queue.country === dto.country 
            && queue.gender === dto.gender 
            && queue.socketId !== socket.id
            && !queue.isBusy);
        if (!partnerQueue){            
            partnerQueue = this.queue.find(queue => (queue.country === dto.country 
                || queue.gender === dto.gender) 
                && queue.socketId !== socket.id
                && !queue.isBusy);
        } 
        if (!partnerQueue) {
            partnerQueue = this.queue.find(queue => !queue.isBusy && queue.socketId !== socket.id);
        }

        let myQueue = this.queue.find(queue => queue.socketId === socket.id);
        
        let roomId = await this.gatewayService.create([dto.userId, partnerQueue.userId]).catch((e) => {
            this.server.to(socket.id).emit('onException', {
                statusCode: e.status,
                message: e.message
            });

            stop();
        });
 
        socket.join(roomId);
        myQueue.isBusy = true;

        const partnerSocket = this.server.sockets.sockets.get(partnerQueue.socketId);
        partnerSocket.join(roomId);
        partnerQueue.isBusy = true;


        this.server.to(roomId).emit('onFindRoom', {
            roomId,
            partner: {
                id: partnerQueue.userId,
                gender: partnerQueue.gender,
                country: partnerQueue.country
            },
            userId: dto.userId,
            gender: dto.gender,
            country: dto.country
        });
    }

    @SubscribeMessage('leaveRoom')
    async onLeaveRoom(@MessageBody() dto: LeaveRoomDto, @ConnectedSocket() socket: Socket) {
        await this.gatewayService.leave(dto).catch((e) => {
            this.server.to(socket.id).emit('onException', {
                statusCode: e.status,
                message: e.message
            });

            stop();
        });

        this.server.to(dto.roomId).emit('onLeaveRoom', {
            membersId: dto.membersId,
            roomId: dto.roomId
        });

        this.queue.forEach(item => {
            dto.membersId.forEach(id => {
                if (item.userId === id) {
                    item.isBusy = false;
                    const memberSocket = this.server.sockets.sockets.get(item.socketId);
                    memberSocket.leave(dto.roomId);
                }
            });
        });

    }

//TODO: ТИпо работает
    @SubscribeMessage('offer')
    handleOffer(data: { offer: any, roomId: string }) {
        this.server.to(data.roomId).emit('offer', data.offer);
    }

    @SubscribeMessage('answer')
    handleAnswer(data: { answer: any, roomId: string }) {
        this.server.to(data.roomId).emit('answer', data.answer);
    }

    @SubscribeMessage('iceCandidate')
    handleIceCandidate(data: { candidate: any, roomId: string }) {
        this.server.to(data.roomId).emit('iceCandidate', data.candidate);
    }

    onModuleInit() {
        this.server.on('connection', socket => {
            this.server.to(socket.id).emit('onConnection', {connectionId: socket.id});
            console.log(`Клиент ${socket.id} был подключен`);
        });
    }
}