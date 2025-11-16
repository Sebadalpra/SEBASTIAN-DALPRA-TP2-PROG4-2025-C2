import { IsString, IsEmail, MinLength, IsDateString, IsOptional, Matches } from 'class-validator';

export class CreateUsuarioDto {
    @IsString()
    nombre: string;

    @IsString()
    apellido: string;

    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    email: string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, { message: 'La contraseña debe tener al menos una mayúscula y un número' })
    password: string;

    @IsDateString({}, { message: 'La fecha de nacimiento debe tener formato (YYYY-MM-DD)' })
    fecha_nacimiento: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsString()
    fotoPerfil?: string;
}
