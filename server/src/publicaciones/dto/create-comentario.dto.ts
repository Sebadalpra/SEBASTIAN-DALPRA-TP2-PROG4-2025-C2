import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateComentarioDto {
@IsOptional() // opcional porque se asigna desde el token
  @IsString()
  username: string;

  @IsString()
  texto: string;

  @IsOptional()
  @IsBoolean()
  modificado?: boolean;
}
