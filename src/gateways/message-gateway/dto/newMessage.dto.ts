import { IsDate, IsNotEmpty } from "class-validator";

export class NewMessageDto {
    @IsNotEmpty()
    text: string;
    
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    roomId: string;
}