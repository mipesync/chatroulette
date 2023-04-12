import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomGateway } from "./room.gateway";
import { RoomGatewayService } from "./room.gateway.service";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { Room, RoomSchema } from "src/room/schemas/room.schema";
import { UserService } from "src/user/user.service";

@Module({    
    imports: [
        MongooseModule.forFeature([
            { name: Room.name, schema: RoomSchema},
            { name: User.name, schema: UserSchema},
        ]),
    ],
    providers: [ RoomGatewayService, RoomGateway, UserService ],
})
export class RoomGatewayModule {}
