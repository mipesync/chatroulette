import { IsNotEmpty } from "class-validator";

export class UpdateUsernameDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    newUserName: string;
}