import { Controller, HttpStatus } from '@nestjs/common';
import { Body,  Get, HttpCode, Param, Post, Put, Req, UseGuards } from '@nestjs/common/decorators';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUsernameDto } from './dto/updateUsername.dto';
import { UserService } from './user.service';
import { BlockUserDto } from './dto/block-user.dto';
import { UnblockUserDto } from './dto/unblock-user.dto';
import { RoomGateway } from 'src/gateways/room-gateway/room.gateway';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService,
        private readonly roomGateway: RoomGateway) {}

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getDetails(@Param('id') userId: string, @Req() req: Request) {
        let result = await this.userService.getDetails(userId).catch((err) => {
            throw err;
        });

        return result;
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    async getUsers() {
        let users = await this.userService.getAll(this.roomGateway.queue).catch((err) => {
            throw err;
        });

        return users;
    }

    @HttpCode(HttpStatus.OK)
    @Get('details/blocked')
    async getBlocked() {
        let users = await this.userService.getBlocked().catch((err) => {
            throw err;
        });

        return users;
    }

    @HttpCode(HttpStatus.OK)
    @Get('details/online')
    async getOnline() {
        let users = await this.userService.getOnline(this.roomGateway.queue).catch((err) => {
            throw err;
        });

        return users;
    }

    @HttpCode(HttpStatus.OK)
    @Put('details/username')
    async updateUsername(@Body() updateUsernameDto: UpdateUsernameDto) {
        await this.userService.updateUsername(updateUsernameDto).catch((err) => {
            throw err;
        });
    }

    @HttpCode(HttpStatus.OK)
    @Post('block')
    async block(@Body() dto: BlockUserDto) {
        await this.userService.block(dto).catch((err) => {
            throw err;
        });
    }

    @HttpCode(HttpStatus.OK)
    @Post('unblock')
    async unblock(@Body() dto: UnblockUserDto) {
        await this.userService.unBlock(dto).catch((err) => {
            throw err;
        });
    }
}
