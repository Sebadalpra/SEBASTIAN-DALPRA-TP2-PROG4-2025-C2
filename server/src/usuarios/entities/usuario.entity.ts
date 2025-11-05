import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

@Schema({collection:'usuarios'})
export class Usuario {

    @Prop({ required: true })
    nombre: string;
    
    @Prop({ required: true })
    apellido: string;

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true, unique: true })
    username: string

    @Prop({ required: true })
    password: string;
    
    @Prop({ required: true })
    fecha_nacimiento: Date;
    
    @Prop({ required: false })
    descripcion: string;

    @Prop({ required: false })
    fotoPerfil: string;

    @Prop( {default: new Date()})
    fecha_creado: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
