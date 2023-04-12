import { IsNotEmpty } from "class-validator";

export class EditMessageDto {
    @IsNotEmpty()
    messageId: string;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    text: string;
}