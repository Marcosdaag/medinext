import { Injectable, OnModuleInit, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

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
}