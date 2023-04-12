import { IsNotEmpty } from "class-validator";

export class CreateRoomDto {
    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    userId: string[];

    @IsNotEmpty()
    country: number;
}