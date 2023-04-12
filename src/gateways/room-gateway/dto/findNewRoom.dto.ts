import { IsNotEmpty } from "class-validator";

export class FindNewRoomDto {
    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    country: number;

    @IsNotEmpty()
    userId: string;
}