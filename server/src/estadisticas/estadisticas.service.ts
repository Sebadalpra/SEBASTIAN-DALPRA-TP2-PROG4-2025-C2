import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Publicaciones } from '../publicaciones/entities/publicacione.entity';

@Injectable()
export class EstadisticasService {
  constructor(@InjectModel('Publicaciones') private publicacionesModel: Model<Publicaciones>) {}

  async getPublicacionesPorUsuario(fechaInicio: string, fechaFin: string) {
    const inicio = fechaInicio ? new Date(fechaInicio + 'T00:00:00.000Z') : new Date(0);
    const finDate = fechaFin ? new Date(fechaFin + 'T23:59:59.999Z') : new Date();
    return this.publicacionesModel.aggregate([
      { $match: { activa: true, fecha_creacion: { $gte: inicio, $lte: finDate } } },
      { $group: { _id: '$username', cantidad: { $sum: 1 } } },
      { $sort: { cantidad: -1 } }
    ]).then(res => res.map(r => ({ username: r._id, cantidad: r.cantidad })));
  }

  async getComentariosTotales(fechaInicio: string, fechaFin: string) {
    const inicio = fechaInicio ? new Date(fechaInicio + 'T00:00:00.000Z') : new Date(0);
    const finDate = fechaFin ? new Date(fechaFin + 'T23:59:59.999Z') : new Date();
    return this.publicacionesModel.aggregate([
      { $match: { activa: true, fecha_creacion: { $gte: inicio, $lte: finDate } } },
      { $unwind: '$comentarios' },
      { $match: { 'comentarios.fecha': { $gte: inicio, $lte: finDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$comentarios.fecha' } }, cantidad: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).then(res => res.map(r => ({ fecha: r._id, cantidad: r.cantidad })));
  }

  async getComentariosPorPublicacion(fechaInicio: string, fechaFin: string) {
    const inicio = fechaInicio ? new Date(fechaInicio + 'T00:00:00.000Z') : new Date(0);
    const finDate = fechaFin ? new Date(fechaFin + 'T23:59:59.999Z') : new Date();
    return this.publicacionesModel.aggregate([
      { $match: { activa: true, fecha_creacion: { $gte: inicio, $lte: finDate } } },
      { $unwind: { path: '$comentarios', preserveNullAndEmptyArrays: true } },
      { $match: { $or: [{ comentarios: { $exists: false } }, { 'comentarios.fecha': { $gte: inicio, $lte: finDate } }] } },
      { $group: { _id: { id: '$_id', titulo: '$titulo' }, cantidad: { $sum: { $cond: [{ $ifNull: ['$comentarios', false] }, 1, 0] } } } },
      { $sort: { cantidad: -1 } },
      { $limit: 10 }
    ]).then(res => res.map(r => ({ publicacionId: r._id.id, titulo: r._id.titulo, cantidad: r.cantidad })));
  }
}
