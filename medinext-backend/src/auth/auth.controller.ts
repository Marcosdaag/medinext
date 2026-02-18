import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.auth.guard';

// Importamos todos los validadores (DTOs)
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResetPasswordDto } from './dto/reset-password-dto';


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
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión (Invalida tokens en todos los dispositivos)' })
  logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  //---Endpoint para solicitar reestablecimiento de password---
  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña (envía email)' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  //---Endpoint para confirmar nueva contraseña---
  @Post('reset-password')
  @ApiOperation({ summary: 'Cambiar la contraseña usando el Token del email' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
