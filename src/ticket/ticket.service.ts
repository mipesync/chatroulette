import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UserService } from 'src/user/user.service';
import { Status } from './enums/status.enum';
import { Roles } from 'src/common/permissions-manager/roles';
import { UpdateTicketStatus } from './dto/update-ticket-status.dto';
import { existsSync, mkdir, writeFile } from 'fs';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { JwtManager } from 'src/auth/jwt/jwt.manager';


@Injectable()
export class TicketService {
    constructor(@InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
        private readonly userService: UserService) {}

    async getAll(token: string): Promise<any> {
        let payload = await new JwtManager().parseToken(token)
        if (payload.role !== Roles.ADMINISTRATOR) throw new ForbiddenException("Вы не являетесь администратором");

        let tickets = await this.ticketModel.find();

        let result: any[] = [];

        tickets.forEach(ticket => {
            result.push({
                id: ticket.id,
                reason: ticket.reason,
                applicant: ticket.applicantId,
                status: ticket.status,
                date: ticket.date
            });
        });

        return result;
    }

    async getById(ticketId: string): Promise<any> {
        let ticket = await this.ticketModel.findById(ticketId);
        if (!ticket) throw new NotFoundException("Жалоба не найдена");

        return {          
            id: ticket.id,  
            reason: ticket.reason,
            status: ticket.status,
            applicantId: ticket.applicantId,
            violatorId: ticket.violatorId,
            date: ticket.date,
            description: ticket.description
        };
    }

    async getByApplicantId(applicantId): Promise<any> {
        let tickets = await this.ticketModel.find({ applicantId: applicantId });
        
        let result: any[] = [];

        tickets.forEach(ticket => {
            result.push({
                id: ticket.id,
                reason: ticket.reason,
                applicant: ticket.applicantId,
                status: ticket.status,
                date: ticket.date
            });
        });

        return tickets;
    }

    async create(dto: CreateTicketDto): Promise<any> {
        await this.userService.getUserById(dto.violatorId);
        await this.userService.getUserById(dto.applicantId);

        const result = await this.ticketModel.create({
            reason: dto.reason,
            status: dto.status,
            applicantId: dto.applicantId,
            violatorId: dto.violatorId,
            date: Date.now(),
            description: dto.description
        });

        return {
            ticketId: result.id
        }
    }

    async updateStatus(dto: UpdateTicketStatus): Promise<void> {
        const judge = await this.userService.getUserById(dto.judgeId);
        if (judge.role !== Roles.ADMINISTRATOR && dto.status !== Status.CLOSED) throw new ForbiddenException("Вы не являетесь администратором");

        let ticket = await this.ticketModel.findById(dto.ticketId);
        if (!ticket) throw new NotFoundException("Жалоба не найдена");

        ticket.status = dto.status;
        ticket.judgeId = dto.judgeId;
        await ticket.save();
    }
    
    async uploadFile(file: Express.Multer.File, ticketId: string){
        let ticket = await this.ticketModel.findById(ticketId);
        if (!ticket) throw new NotFoundException('Жалоба не найдена');
        
        const _fileRootPath: string = `./storage/ticket/attachments/${ticketId}/`;
        if (!existsSync(_fileRootPath)){
            await mkdir(_fileRootPath, {recursive: true}, (err) => { console.log(err)});
        }
        
        let _fileName: string = `${uuid()}${extname(file.originalname)}`;

        writeFile(join(_fileRootPath, _fileName), file.buffer, (err) => {
            if (err) {
                return console.log(err);
            }
        });

        ticket.files.push(_fileName);
        await ticket.save();
        
        return {
            fileUrl: `/ticket/attachments/${ticketId}/`.concat(_fileName),
            fileName: _fileName
        };
    }
}
