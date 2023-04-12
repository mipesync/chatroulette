import { IsNotEmpty } from "class-validator";

export class GatewayRoomDto {
    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    country: number;

    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    userId: string[];
}