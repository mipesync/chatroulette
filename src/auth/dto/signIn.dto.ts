import { IsBoolean, IsNotEmpty } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsBoolean()
    rememberMe: boolean;

    @IsNotEmpty()
    authStrategy: string;
}