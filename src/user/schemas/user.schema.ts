import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Roles } from "src/common/permissions-manager/roles";
import { Reason } from "src/ticket/enums/reason.enum";

export type UserDocument = User & Document;

@Schema()
export class User{
    @Prop({ required: true, unique: true })
    username: string;
    
    @Prop()
    firstname?: string;
     
    @Prop()
    lastname?: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    gender: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    googleId?: string;

    @Prop()
    yandexId?: string;

    @Prop()
    vkontakteId?: string;

    @Prop()
    blocked?: boolean;

    @Prop()
    lockdownEnd?: number;

    @Prop()
    country?: number;

    @Prop()
    reason?: Reason;

    @Prop()
    role: Roles;

    @Prop()
    refreshHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);