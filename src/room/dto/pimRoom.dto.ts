import { IsNotEmpty } from "class-validator";

export class PinRoomDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    roomId: string;
}