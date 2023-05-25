import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoomGatewayModule } from './gateways/room-gateway/room.gateway.module';
import { MessageGatewayModule } from './gateways/message-gateway/message.gateway.module';
import { RoomModule } from './room/room.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MessageModule } from './message/message.module';
import { JwtManager } from './auth/jwt/jwt.manager';
import { TicketModule } from './ticket/ticket.module';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'storage/'),
            exclude: ['/api*', '/join']
        }),
        AuthModule,
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        MongooseModule.forRoot(process.env.MONGO_URL),
        UserModule,
        RoomGatewayModule,
        MessageGatewayModule,
        RoomModule,
        MessageModule,
        TicketModule
    ],
    controllers: [],
    providers: [JwtManager],
})
export class AppModule {}
