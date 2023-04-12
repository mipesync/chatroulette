import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatus } from './dto/update-ticket-status.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    async getAll(@Req() req: Request): Promise<any> {
        const result = await this.ticketService.getAll(req.header('Authorization').replace('Bearer ', '')).catch((err) => {
            throw err;
        });

        return result;
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async getById(@Param('id') ticketId: string): Promise<any> {        
        const result = await this.ticketService.getById(ticketId).catch((err) => {
            throw err;
        });

        return result;
    }

    @HttpCode(HttpStatus.OK)
    @Get('?applicantId')
    async getByApplicantId(@Query('applicantId') applicantId: string): Promise<any> {
        const result = await this.ticketService.getByApplicantId(applicantId).catch((err) => {
            throw err;
        });

        return result;
    }

    @HttpCode(HttpStatus.OK)
    @Post()
    async create(@Body() dto: CreateTicketDto): Promise<any> {
        const result = await this.ticketService.create(dto).catch((err) => {
            throw err;
        });

        return result;
    }

    @HttpCode(HttpStatus.OK)
    @Post('status')
    async updateStatus(@Body() dto: UpdateTicketStatus): Promise<any> {
        const result = await this.ticketService.updateStatus(dto).catch((err) => {
            throw err;
        });

        return result;
    }
    
    @Post('uploadFile/:ticketId') 
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(HttpStatus.OK)
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('ticketId') ticketId: string, @Req() req: Request) {
        let result = await this.ticketService.uploadFile(file, ticketId).catch((err) => {
            throw err;
        });
        result.fileUrl = req.protocol.concat('://', req.headers['host'], result.fileUrl);

        return result;
    }
}
