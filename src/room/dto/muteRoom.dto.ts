import { IsNotEmpty } from "class-validator";

export class MuteRoomDto {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    userId: string;
}