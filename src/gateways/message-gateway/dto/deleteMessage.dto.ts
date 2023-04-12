import { IsNotEmpty } from "class-validator";

export class DeleteMessageDto {
    @IsNotEmpty()
    messageId: string;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    roomId: string;
}