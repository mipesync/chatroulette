import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Reason } from "../enums/reason.enum";
import { Status } from "../enums/status.enum";

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket{
    @Prop({ isRequired: true })
    reason: Reason;

    @Prop({ isRequired: true })
    status: Status;

    @Prop({ isRequired: true })
    violatorId: string;

    @Prop({ isRequired: true })
    applicantId: string;

    @Prop()
    judgeId?: string;

    @Prop({ isRequired: true })
    description: string;

    @Prop()
    files?: string[];

    @Prop()
    roomId?: string;

    @Prop({ required: true })
    date: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);