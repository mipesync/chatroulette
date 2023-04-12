import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtManager } from 'src/auth/jwt/jwt.manager';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoomGateway } from 'src/gateways/room-gateway/room.gateway';
import { RoomGatewayService } from 'src/gateways/room-gateway/room.gateway.service';
import { Room, RoomSchema } from 'src/room/schemas/room.schema';

@Module({    
    imports: [
        MongooseModule.forFeature([
          { name: Room.name, schema: RoomSchema},
          { name: User.name, schema: UserSchema}])
    ],
    controllers: [UserController],
    providers: [UserService, JwtManager, RoomGateway, RoomGatewayService]
  })
export class UserModule {}
