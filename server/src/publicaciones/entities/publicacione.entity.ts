import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Publicaciones {
    @Prop({ required: true })
    usuario: string;

    @Prop({ required: true })
    titulo: string;

    @Prop({ required: true })
    mensaje: string;

    @Prop({ required: true })
    imagen: string;
}

export const PublicacionesSchema = SchemaFactory.createForClass(Publicaciones);
