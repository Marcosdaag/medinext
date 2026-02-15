import { Injectable, OnModuleInit, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import sharp from 'sharp';
@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

    private supabase;

    constructor() {
        super();
        this.supabase = createClient(
            process.env.SUPABASE_URL as string,
            process.env.SUPABASE_KEY as string
        );
    }

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

    //---Subir una imagen de perfil---
    async uploadAvatar(userId: string, file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No se ha proporcionado ninguna imagen.');

        //Redimensionamos a 400x400 la imagen
        const optimizedBuffer = await sharp(file.buffer)
            .resize(400, 400, { fit: 'cover' })
            .webp({ quality: 100 })
            .toBuffer();

        //Como usamos el user id para el titulo, sobreescribe la imagen anterior para no ocupar espacio de mas
        const fileName = `${userId}.webp`;

        //Subir optimizacion al storage
        const { error } = await this.supabase.storage
            .from('avatars')
            .upload(fileName, optimizedBuffer, {
                contentType: 'image/webp',
                upsert: true //Sobreescritura
            });

        if (error) throw new BadRequestException('Error al subir a Supabase: ' + error.message);

        //Obtener la url generada
        const { data: { publicUrl } } = this.supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        //Guardar la URL en la tabla User de Prisma y agregar un timestamp al final para evitar qeu se muestre la foto vieja
        return await this.user.update({
            where: { id: userId },
            data: { avatarUrl: `${publicUrl}?t=${Date.now()}` },
            select: { id: true, avatarUrl: true }
        });
    }

    //---Obtener todos los usuarios (Solo ADMIN)---
    async findAllUsers() {
        return this.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                dni: true,
                roles: true,
                avatarUrl: true,
                createdAt: true,
            }
        });
    }
}