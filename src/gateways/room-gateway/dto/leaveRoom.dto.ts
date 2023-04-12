import { IsNotEmpty } from "class-validator";

export class LeaveRoomDto {
    @IsNotEmpty()
    membersId: string[];

    @IsNotEmpty()
    roomId: string;
}