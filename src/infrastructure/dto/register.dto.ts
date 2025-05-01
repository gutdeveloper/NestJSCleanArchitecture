import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class RegisterUserDTO {
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    first_name: string;

    @IsString()
    @MaxLength(50)
    @MinLength(3)
    last_name: string;

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