import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtManager } from 'src/auth/jwt/jwt.manager';
import { Message, MessageSchema } from 'src/message/schemas/message.schema';
import { Room, RoomSchema } from 'src/room/schemas/room.schema';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({    
  imports: [
      MongooseModule.forFeature([
        { name: Room.name, schema: RoomSchema},
        { name: Message.name, schema: MessageSchema}])
  ],
  controllers: [RoomController],
  providers: [RoomService, JwtManager]
})
export class RoomModule {}
