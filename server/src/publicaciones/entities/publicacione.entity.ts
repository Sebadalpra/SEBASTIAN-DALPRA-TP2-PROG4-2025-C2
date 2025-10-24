import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Publicaciones {
    @Prop()
    titulo: string;

    @Prop()
    mensaje: string;

    @Prop()
    imagen: string;
}
