import { Controller, Get, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //---Mostrar datos del usuario---
  @Get('profile')
  @ApiOperation({ summary: 'Obtener mi perfil de usuario' })
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  //---Actualizar datos obligatorios del user
  @Patch('profile')
  @ApiOperation({ summary: 'Actualizar datos' })
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  //---Cambiar password---
  @Patch('change-password')
  @ApiOperation({ summary: 'Cambiar la contraseña del usuario logueado' })
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, changePasswordDto);
  }
}