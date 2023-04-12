import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RoomDocument = Room & Document;

@Schema()
export class Room {
    @Prop({ required: true })
    startTime: number;

    @Prop()
    endTime: number;

    @Prop({ length: 2, required: true })
    userId: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);