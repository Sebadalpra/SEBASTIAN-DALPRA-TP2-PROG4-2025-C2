import { IsString } from 'class-validator';

export class CreatePublicacionesDto {
    @IsString() 
    username: string;

    @IsString()
    titulo: string;

    @IsString()
    mensaje: string;

    @IsString()
    imagen: string;
}


