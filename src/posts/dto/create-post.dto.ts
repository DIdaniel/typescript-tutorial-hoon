// @(decorator) 사용할 수 있음
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    public author: string;

    @IsString()
    public title: string;

    @IsString()
    public content: string;
}
