import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBearerAuth} from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './jwt.auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';


@ApiTags('Auth')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //---Endpoint de registro llamando al metodo register---
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  //---Endpoint de login---
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener Token' })
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  //---Endpoint de logout general---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión (Invalida tokens en todos los dispositivos)' })
  logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }
}
