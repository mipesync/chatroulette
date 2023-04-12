import { Controller, HttpCode, HttpStatus, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { MessageService } from './message.service';

@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

}
