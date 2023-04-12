import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Room, RoomDocument } from "src/room/schemas/room.schema";
import { LeaveRoomDto } from "./dto/leaveRoom.dto";

@Injectable()
export class RoomGatewayService {
    constructor(
        @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>
    ) { }

    async create(usersId: string[]): Promise<any> {
        const room = await this.roomModel.create({
           startTime: Date.now(),
           userId: usersId
        });

        return room.id;
    }

    async leave(dto: LeaveRoomDto): Promise<void> {
        let room = await this.roomModel.findById(dto.roomId);
        if (!room) throw new NotFoundException('Комната не найдена');

        room.endTime = Date.now();
        await room.save();
    }
}