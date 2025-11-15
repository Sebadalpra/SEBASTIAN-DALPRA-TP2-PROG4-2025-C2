import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Comentario {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  texto: string;

  @Prop({ default: new Date() })
  fecha: Date;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
