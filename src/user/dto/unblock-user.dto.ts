import { IsDate, IsNotEmpty } from "class-validator"
import { Reason } from "src/ticket/enums/reason.enum";

export class UnblockUserDto {
    @IsNotEmpty()
    userId: string;
    
    @IsNotEmpty()
    judgeId: string;
}