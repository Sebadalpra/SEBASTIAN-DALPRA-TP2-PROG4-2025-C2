import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtCookieGuard } from 'src/guards/jwt-cookie/jwt-cookie.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  crearUsuario(@Body() dtoUsuario: CreateUsuarioDto) {
    return this.usuariosService.create(dtoUsuario);
  }

  @Get()
  @UseGuards(JwtCookieGuard)
  findAll(@Req() req: any) {
    // Validar que sea admin
    const rol = (req as any).user.rol;
    if (rol !== 'admin') {
      throw new ForbiddenException('Solo administradores pueden ver el listado de usuarios');
    }
    return this.usuariosService.findAll();
  }

  @Get(':username')
  @UseGuards(JwtCookieGuard)
  findOne(@Param('username') username: string) {
    return this.usuariosService.findOne(username);
  }

  @Patch(':id/alta-baja')
  @UseGuards(JwtCookieGuard) 
  activar(@Param('id') id: string , @Req() req: any) {
    return this.usuariosService.altaBaja(id);
  }
}
