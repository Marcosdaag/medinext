import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// Importamos todos los DTOs
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ResetPasswordDto } from './dto/reset-password-dto';

// Importamos el servicio de correos
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService extends PrismaClient {

  constructor(
    private jwtService: JwtService,
    private mailService: MailService
  ) {
    super(); //inicializa Prisma
  }

  //---Metodo-Funcion de registro---
  async register(registerDto: RegisterAuthDto) {
    const { email, password, fullName } = registerDto;

    //Hasheo de password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Guardar datos en la db
    const user = await this.user.create({
      data: {
        email,
        fullName,
        hashedPassword: hashedPassword,
        roles: ['USER'],
      },
    });

    return {
      message: 'Usuario registrado exitosamente.',
      user: { id: user.id, email: user.email }
    };
  }

  //---Metodo-Funcion de login---
  async login(loginDto: LoginAuthDto) {
    const { email, password } = loginDto;

    //Busca usuario por email
    const user = await this.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    //Si se encuentra el email ingresado, verifica la password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    //En caso de cumplir todo lo anterior se loguea correctamente y genera un token
    const payload = { sub: user.id, email: user.email, roles: user.roles, version: user.tokenVersion };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  //---Metodo-Funcion de logout en todos los dispositivos---
  async logout(userId: string) {
    //Hago un update del token y tdos los actuales mueren
    await this.user.update({
      where: { id: userId },
      data: {
        tokenVersion: { increment: 1 }
      }
    });

    return { message: 'Sesión cerrada correctamente en todos los dispositivos.' };
  }

  // ---Metodo-Funcion para pedir recuperación de contraseña---
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.user.findUnique({ where: { email } });

    if (!user) {
      return { message: 'Si el correo está registrado, recibirás un enlace de recuperación.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await this.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetPasswordExpires,
      }
    });

    // 4. ¡Despachamos el correo!
    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Si el correo está registrado, recibirás un enlace de recuperación.' };
  }

  // --- Metodo-Funcion para cambiar la contraseña con el token---
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    // 1. Buscamos un usuario que tenga ese token exacto Y que la fecha actual sea menor a la de vencimiento
    const user = await this.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(), // "gt" = greater than (mayor que ahora)
        }
      }
    });

    if (!user) {
      throw new BadRequestException('El enlace de recuperación es inválido o ha expirado.');
    }

    // 2. Si todo está OK, hasheamos la nueva clave
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 3. Guardamos la nueva clave y BORRAMOS el token para que no se pueda volver a usar
    await this.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: hashedNewPassword,
        resetPasswordToken: null,    // <-- Limpiamos el token
        resetPasswordExpires: null,  // <-- Limpiamos el vencimiento
        passwordChangedAt: new Date(),
        tokenVersion: { increment: 1 } // <-- Matamos las sesiones viejas por seguridad
      }
    });

    return { message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' };
  }
}