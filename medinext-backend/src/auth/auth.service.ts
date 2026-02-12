import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService extends PrismaClient {

  constructor(private jwtService: JwtService) {
    super(); //inicializa Prisma
  }

  // --- REGISTRO ---
  async register(registerDto: RegisterAuthDto) {
    const { email, password, fullName } = registerDto;

    // 1. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Guardar en DB
    const user = await this.user.create({
      data: {
        email,
        fullName,
        hashedPassword: hashedPassword,
        roles: ['USER'],
      },
    });

    return {
      message: 'Usuario registrado exitosamente',
      user: { id: user.id, email: user.email }
    };
  }

  // --- LOGIN ---
  async login(loginDto: LoginAuthDto) {
    const { email, password } = loginDto;

    // 1. Buscar usuario
    const user = await this.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Verificar password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generar Token
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
