import { OnModuleInit, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { WsGuard } from "src/auth/jwt/ws.guard";
import { RoomGatewayService } from "./room.gateway.service";
import { FindNewRoomDto } from "./dto/findNewRoom.dto";
import { UserService } from "src/user/user.service";
import { User } from "src/user/schemas/user.schema";
import { LeaveRoomDto } from "./dto/leaveRoom.dto";
import { Queue } from "./queue";
import { RedisClientType, createClient } from "redis";

@WebSocketGateway({ cors: true })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    redis: RedisClientType;

    constructor(private readonly gatewayService: RoomGatewayService,
        private readonly userService: UserService) {            
            this.redis = createClient();
            (async () => {
                await this.redis.connect();
            })();
            this.redis.on('error', err => console.log('Redis Client Error', err));
            this.redis.on('connect', () => console.log('Redis Client Connected'));
        }

    @WebSocketServer() 
    private server: Server;

    async handleConnection(@ConnectedSocket() socket: Socket) {
        console.log(`Клиент ${socket.id} был подключен`);
        
        await this.redis.set(socket.id, "");  
    }

    async handleDisconnect(@ConnectedSocket() socket: Socket) {   
        let queue = await this.redis.get(socket.id);
        if (queue) {
            await this.redis.del(socket.id);
        }    
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('joinToQueue')
    async joinToQueue(@MessageBody() dto: FindNewRoomDto, @ConnectedSocket() socket: Socket) {
        let user = await this.userService.getUserById(dto.userId).catch((e) => {
            this.server.to(socket.id).emit('onException', {
                statusCode: e.status,
                message: e.message
            });

            stop();
        }) as User;

        let queue: Queue = {
            socketId: socket.id,
            userId: dto.userId,
            gender: dto.gender,
            country: dto.country,
            isBusy: false
        };

        await this.redis.set(queue.socketId, JSON.stringify(queue));

        socket.emit("onJoinToQueue", {
            status: "OK"
        });
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('findRoom')
    async findNewRoom(@MessageBody() dto: FindNewRoomDto, @ConnectedSocket() socket: Socket) {
        let queuesKey = await this.redis.keys("*");

        let queues: Queue[] = [];

        queuesKey.forEach(async queueKey => {
            let queue: Queue = JSON.parse(await this.redis.get(queueKey)) as Queue;
            queues.push(queue);
        });

        let partnerQueue = queues.find(queue => queue.country === dto.country 
            //  && queue.gender === dto.gender 
            //  && queue.socketId !== socket.id
            //  && !queue.isBusy
              );
          if (!partnerQueue){            
              partnerQueue = queues.find(queue => (queue.country === dto.country 
                  || queue.gender === dto.gender) 
                //  && queue.socketId !== socket.id
                  && !queue.isBusy);
          } 
          if (!partnerQueue) {
              partnerQueue = queues.find(queue => !queue.isBusy /*&& queue.socketId !== socket.id*/);
          }
          
          let myQueue = queues.find(queue => queue.socketId === socket.id);
  
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
          
          this.server.to(partnerQueue.socketId).emit("waitOffer", {from: socket.id});
          this.server.to(socket.id).emit("makeOffer", {to: partnerQueue.socketId});
      //	this.server.to(partnerQueue.socketId).emit("waitOffer", {from: socket.id, to: partnerQueue.socketId});
          this.server.to(roomId).emit('onFindRoom', {
              roomId,
              socketId:socket.id,
              partner: {
                  id: partnerQueue.userId,
                  socketId: partnerQueue.socketId,
                  gender: partnerQueue.gender,
                  country: partnerQueue.country
              },
              userId: dto.userId,
              gender: dto.gender,
              country: dto.country
          });
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('leaveRoom')
    async onLeaveRoom(@MessageBody() dto: LeaveRoomDto, @ConnectedSocket() socket: Socket) {
        let queuesKey = await this.redis.keys("*");

        let queues: Queue[] = [];

        queuesKey.forEach(async queueKey => {
            let queue: Queue = JSON.parse(await this.redis.get(queueKey)) as Queue;
            queues.push(queue);
        });

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

        queues.forEach(item => {
            dto.membersId.forEach(id => {
                if (item.userId === id) {
                    item.isBusy = false;
                    const memberSocket = this.server.sockets.sockets.get(item.socketId);
                    memberSocket.leave(dto.roomId);
                }
            });
        });

    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('offer')
    handleOffer(@MessageBody() data: { offer: any, roomId: string }) {
        this.server.to(data.roomId).emit('offer', data.offer);
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('answer')
    handleAnswer(@MessageBody() data: { answer: any, roomId: string }) {
        this.server.to(data.roomId).emit('answer', data.answer);
    }

    //@UseGuards(WsGuard)
    @SubscribeMessage('iceCandidate')
    handleIceCandidate(data: { candidate: any, roomId: string }) {
        this.server.to(data.roomId).emit('iceCandidate', data.candidate);
    }
}