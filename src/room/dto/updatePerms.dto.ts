import { IsNotEmpty } from "class-validator";

export class UpdatePermsDto {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    origin: string;

    @IsNotEmpty()
    target: string;

    @IsNotEmpty()
    newRole: number;
}