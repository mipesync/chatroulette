import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Room, RoomSchema } from "src/room/schemas/room.schema";
import { MessageGateway } from "./message.gateway";
import { MessageGateWayService } from "./message.gateway.service";
import { Message, MessageSchema } from "../../message/schemas/message.schema";
import { UserService } from "src/user/user.service";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { CryptoManager } from "src/common/crypto-manager/crypto-manager";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
            { name: Room.name, schema: RoomSchema },
            { name: User.name, schema: UserSchema}
        ])],
    providers: [ MessageGateWayService, MessageGateway, UserService, CryptoManager ]
})
export class MessageGatewayModule {}