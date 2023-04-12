import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MessageDocument = Message & Document;

@Schema()
export class Message{
    @Prop()
    text?: string;

    @Prop({ required: true })
    date: number;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    roomId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);