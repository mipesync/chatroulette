import { IsNotEmpty } from "class-validator";
import { Status } from "../enums/status.enum";

export class UpdateTicketStatus {
    @IsNotEmpty()
    judgeId: string;

    @IsNotEmpty()
    status: Status;

    @IsNotEmpty()
    ticketId: string;
}