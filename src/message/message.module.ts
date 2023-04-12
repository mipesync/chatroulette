import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/message/schemas/message.schema';
import { Room, RoomSchema } from 'src/room/schemas/room.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Room.name, schema: RoomSchema },
    ])
  ],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
