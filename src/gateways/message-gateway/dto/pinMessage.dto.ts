import { IsNotEmpty } from "class-validator";

export class PinMessageDto {
    @IsNotEmpty()
    messageId: string;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    roomId: string;
}