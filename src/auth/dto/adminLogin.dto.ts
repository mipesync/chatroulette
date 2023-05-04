import { IsEmail, IsNotEmpty } from "class-validator";

export class AdminLoginDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    password: string;
}