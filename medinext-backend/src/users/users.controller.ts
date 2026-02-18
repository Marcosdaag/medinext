import { Controller, Get, Body, Post, Patch, UseGuards, Request, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFile, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserByAdminDto } from './dto/update-user-admin';

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

  //---Actualizar foto de perfil---
  @Post('upload-avatar')
  @ApiOperation({ summary: 'Subir o actualizar foto de perfil' })
  @ApiConsumes('multipart/form-data') // Necesario para que Swagger muestre el botón de "Elegir archivo"
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }), // Máximo 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), // Solo imágenes
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(req.user.userId, file);
  }

  //---Obtener listado de todos los users---
  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios (Solo Super Admin)' })
  @Roles(Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  getAllUsers() {
    return this.usersService.findAllUsers();  
  }

  //---Editar nombre y rol de usuario---
  @Patch(':id/admin')
  @ApiOperation({ summary: 'Editar cualquier usuario (Solo Super Admin)' })
  @Roles(Role.SUPERADMIN)
  @UseGuards(RolesGuard)
  updateByAdmin(@Param('id') id: string, @Body() updateDto: UpdateUserByAdminDto) {
    return this.usersService.updateUserByAdmin(id, updateDto);
  }
}