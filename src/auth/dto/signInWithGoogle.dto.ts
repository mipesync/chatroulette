import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInWithGoogleDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()    
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    googleId: string;
}