import { IsString, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsString()
    public name: string;

    @IsString()
    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}
