import { IsNotEmpty } from "class-validator";
import { Reason } from "../enums/reason.enum";
import { Status } from "../enums/status.enum";

export class CreateTicketDto {
    @IsNotEmpty()
    reason: Reason;
    
    @IsNotEmpty()
    status: Status;

    @IsNotEmpty()
    violatorId: string;

    @IsNotEmpty()
    applicantId: string;

    @IsNotEmpty()
    description: string;
}