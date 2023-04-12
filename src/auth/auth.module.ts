import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { GoogleStrategy } from './oauth20/google.oauth20/auth/google.strategy';
import { YandexStrategy } from './oauth20/yandex.oauth20/yandex.strategy';
import { VkStrategy } from './oauth20/vk.oauth20/vk.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema}]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy, YandexStrategy, VkStrategy]
})
export class AuthModule {}
