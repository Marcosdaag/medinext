import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { CreateOverrideDto } from './dto/create-override.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaClient) {}

  //---Metodo para completar datos al tener el rango de DOCTOR---
  async createProfile(userId: string, dto: CreateDoctorDto) {
    const existing = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (existing) throw new BadRequestException('Ya tenés un perfil médico activo.');

    return this.prisma.doctorProfile.create({
      data: {
        userId,
        specialty: dto.specialty,
        visitPrice: 0,
        visitDuration: 30,
      },
    });
  }

  //---Buscar perfil con horarios y exepciones---
  async getMyProfile(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        availabilities: true,
        overrides: true,
      }
    });
    return profile;
  }

  //---Actualizar precio y tiempo de consulta---
  async updateConfig(userId: string, dto: UpdateDoctorDto) {
    // Primero verificamos que exista el perfil
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Primero debés crear tu perfil médico.');

    return this.prisma.doctorProfile.update({
      where: { userId },
      data: {
        visitPrice: dto.visitPrice,
        visitDuration: dto.visitDuration,
      },
    });
  }

  //---Agregar disponibilidad---
  async addAvailability(userId: string, dto: CreateAvailabilityDto) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Perfil médico no encontrado.');

    if (dto.startTime >= dto.endTime) {
        throw new BadRequestException('La hora de fin debe ser mayor a la de inicio.');
    }

    return this.prisma.availability.create({
      data: {
        doctorId: profile.id,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });
  }

  //---Agregar vacaciones---
  async addOverride(userId: string, dto: CreateOverrideDto) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Perfil médico no encontrado.');

    return this.prisma.scheduleOverride.create({
      data: {
        doctorId: profile.id,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
      },
    });
  }
}
