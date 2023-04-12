import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Room, RoomDocument } from "src/room/schemas/room.schema";
import { NewMessageDto } from "./dto/newMessage.dto";
import { Message, MessageDocument } from "../../message/schemas/message.schema";
import { CryptoManager } from "src/common/crypto-manager/crypto-manager";

//TODO: Доделать шифрование
@Injectable()
export class MessageGateWayService {
    constructor(@InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
        @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
        private readonly cryptoManager: CryptoManager) {}

    async newMessage(dto: NewMessageDto) {
        let room = await this.roomModel.findById(dto.roomId);
        if (room === null) throw new NotFoundException('Комнаты не существует');        

        let result = await this.messageModel.create({
            userId: dto.userId,
            text: dto.text,
            roomId: dto.roomId,
            date: Date.now()
        });
        
        if (typeof result === "string") {
            return result;
        } else {
            return result.id;
        }
    }
}