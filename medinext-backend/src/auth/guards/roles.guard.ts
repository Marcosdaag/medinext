import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        //Leer la etiqueta de la ruta
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        //Si la ruta no tiene etiqueta, pasa cualquiera
        if (!requiredRoles) {
            return true;
        }

        //Obtener el usuario de la petición
        const { user } = context.switchToHttp().getRequest();

        //Validar si el usuario existe y tiene roles
        if (!user || !user.roles) {
            throw new ForbiddenException('No tienes roles asignados para acceder aquí.');
        }

        //Comparar los roles del usuario con los que pide la ruta
        const hasRole = requiredRoles.some((role) => user.roles.includes(role));

        if (!hasRole) {
            throw new ForbiddenException('No tienes los permisos necesarios para realizar esta acción.');
        }

        //Si llegó hasta acá, lo dejamos pasar
        return true;
    }
}