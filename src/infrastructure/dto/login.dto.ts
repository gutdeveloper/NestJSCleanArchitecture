import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDTO {
    @IsEmail()
    @IsString()
    @MaxLength(255)
    @MinLength(6)
    email: string;

    @IsString()
    @MaxLength(20)
    @MinLength(6)
    password: string;
}