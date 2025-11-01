import { IsNotEmpty, isNotEmpty, IsString } from "class-validator";

export class CredencialesDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}