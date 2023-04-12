import { Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, Param, ParseFilePipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtManager } from 'src/auth/jwt/jwt.manager';
import { MuteRoomDto } from './dto/muteRoom.dto';
import { PinRoomDto } from './dto/pimRoom.dto';
import { UpdatePermsDto } from './dto/updatePerms.dto';
import { RoomService } from './room.service';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService, private readonly jwtManager: JwtManager) {}
    
    @HttpCode(HttpStatus.OK)
    @Get('details/:roomId')
    async getRoomDetails(@Param('roomId') roomId: string, @Req() req: Request) {
        let result = await this.roomService.getRoomDetails(roomId).catch((err) => {
            throw err;
        });

        return result;
    }

    @HttpCode(HttpStatus.OK)
    @Get('messages/:roomId')
    async getRoomMessages(@Param('roomId') roomId: string, @Req() req: Request) {
        let result = await this.roomService.getRoomMessages(roomId).catch((err) => {
            throw err;
        });

        return result;
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:userId')
    async getUserRooms(@Param('userId') userId: string, @Req() req: Request) {        
        let rooms = await this.roomService.getUserRooms(userId).catch((err) => {
            throw err;
        });

        return rooms;
    }
}
