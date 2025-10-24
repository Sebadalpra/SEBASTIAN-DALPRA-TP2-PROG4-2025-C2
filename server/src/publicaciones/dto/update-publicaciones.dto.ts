import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicacionesDto } from './create-publicaciones.dto';

export class UpdatePublicacionesDto extends PartialType(CreatePublicacionesDto) {}
