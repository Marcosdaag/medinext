import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  private prisma = new PrismaClient();

  constructor(configService: ConfigService) {
    super({
      //Extraer el token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  //Si el token es valido nest llama a la funcion automaticamente
  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { tokenVersion: true }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    if (user.tokenVersion !== payload.version) {
      throw new UnauthorizedException(
        'La sesión ha expirado o la contraseña fue cambiada. Inicia sesión de nuevo.'
      );
    }

    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}