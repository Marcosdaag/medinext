import { Injectable, OnModuleInit, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect();
    }

    //---Metodo para buscar un usuario---
    async findOne(id: string) {
        return this.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                dni: true,
                roles: true,
                avatarUrl: true,
                timeZone: true,
            }
        });
    }

    //---Actualizar datos del perfil---
    async updateProfile(id: string, updateUserDto: UpdateUserDto) {
        return this.user.update({
            where: { id },
            data: {
                ...updateUserDto,
            },
            select: {
                id: true,
                fullName: true,
                dni: true,
                email: true
            }
        });
    }

    //---Cambiar contraseña---
    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;

        //Buscamos al usuario en la base de datos
        const user = await this.user.findUnique({
            where: { id: userId }
        });

        //En caso de haber un error (comunmente token expired) mandamos usuario no encontrado
        if (!user) {
            throw new NotFoundException('Usuario no encontrado.');
        }

        //Comparamos el input de oldPassword con la password actual del usuario
        const isPasswordValid = await bcrypt.compare(oldPassword, user.hashedPassword);

        //Manejamos el error de ingresar una password incorrecta
        if (!isPasswordValid) {
            throw new UnauthorizedException('La contraseña anterior es incorrecta.');
        }

        //Hasheamos la nueva password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        //Actualizamos el valor de hashedPassword con la nueva hashedNewPassword
        await this.user.update({
            where: { id: userId },
            data: {
                hashedPassword: hashedNewPassword,
                passwordChangedAt: new Date(),
                tokenVersion: { increment: 1 }
            }
        });

        return { message: 'Contraseña actualizada correctamente, Por seguridad, debe iniciar sesión de nuevo.' };
    }
}