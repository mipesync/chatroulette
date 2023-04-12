import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/message/schemas/message.schema';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema},
      { name: Ticket.name, schema: TicketSchema},
      { name: User.name, schema: UserSchema},
    ]),
  ],
  providers: [TicketService, UserService],
  controllers: [TicketController]
})
export class TicketModule {}
