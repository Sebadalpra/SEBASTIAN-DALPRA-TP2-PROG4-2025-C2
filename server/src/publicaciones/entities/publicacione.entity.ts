import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Comentario, ComentarioSchema } from "./comentario.entity";

@Schema()
export class Publicaciones {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    titulo: string;

    @Prop({ required: true })
    mensaje: string;

    @Prop({ required: true })
    imagen: string;

    @Prop({ default: new Date() })
    fecha_creacion: Date;

    @Prop({ type: [String], default: [] })
    likes: string[];

    @Prop({ type: [ComentarioSchema], default: [] })
    comentarios: Comentario[];
}

export const PublicacionesSchema = SchemaFactory.createForClass(Publicaciones);