import { IsString } from "class-validator";

export class CreatePublicacionesDto {
    @IsString()
    titulo: string;

    @IsString()
    mensaje: string;

    @IsString()
    imagen: string;
}


