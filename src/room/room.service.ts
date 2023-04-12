import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from 'src/room/schemas/room.schema';
import { Message, MessageDocument } from 'src/message/schemas/message.schema';
import { UserRoomsViewModel } from './viewModels/userRooms.viewModel';

@Injectable()
export class RoomService {
    constructor(@InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
        @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>) { }

    async getRoomDetails(roomId: string) {
        let room = await this.roomModel.findById(roomId);
        if (room === null) throw new NotFoundException('Комнаты не существует');

        let message = await this.messageModel.findOne({ roomId: roomId }).sort({ _id: -1 });

        let lastMessage = null;
        if (message) {
            lastMessage = {
                text: message.text,
                userId: message.userId,
                date: message.date
            }
        }

        return {
            id: room.id,
            startTime: room.startTime,
            endTime: room.endTime,
            members: room.userId
        }
    }

    async getRoomMessages(roomId: string) {
        let room = await this.roomModel.findById(roomId);
        if (room === null) throw new NotFoundException('Комнаты не существует');

        let messages = await this.messageModel.find( { roomId: roomId } );

        let result: any[] = [];

        messages.forEach(message => {
            result.push({
                id: message.id,
                text: message.text,
                date: message.date,
                userId: message.userId
            });
        });
        return result;
    }
    
    async getUserRooms(userId: string): Promise<UserRoomsViewModel[]> {
        let rooms = await this.roomModel.find({ userId: userId });

        let result: any[] = [];

        rooms.forEach(room => {
            result.push({
                id: room.id,
                startTime: room.startTime,
                endTime: room.endTime
            });
        });

        return result;
    }
}
