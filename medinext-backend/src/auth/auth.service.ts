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
}
