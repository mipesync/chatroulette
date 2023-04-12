import { IsDate, IsNotEmpty } from "class-validator"
import { Reason } from "src/ticket/enums/reason.enum";

export class BlockUserDto {
    @IsNotEmpty()
    userId: string;
    
    @IsNotEmpty()
    judgeId: string;
    
    @IsNotEmpty()
    lockdownEnd: number;

    @IsNotEmpty()
    reason: Reason;
}