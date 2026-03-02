import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateOverrideDto } from './dto/create-override.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Doctors')
@ApiBearerAuth()
@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege toda la ruta
@Roles('DOCTOR') // Exige rol DOCTOR para todo
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  //---Endpoint para completar el perfil inicial---
  @Post('profile')
  @ApiOperation({ summary: 'Completar la especialidad al ascender a doctor' })
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateDoctorDto,
  ) {
    return this.doctorsService.createProfile(userId, dto);
  }

  //---Endpoint para ver informacion completa---
  @Get('me')
  @ApiOperation({ summary: 'Ver perfil completo del doctor' })
  getMe(@CurrentUser('userId') userId: string) {
    return this.doctorsService.getMyProfile(userId);
  }

  //---Endpoint para cambiar precio y duracion de los turnos---
  @Patch('config')
  @ApiOperation({ summary: 'Edicion de precio y duracion de los turnos' })
  updateConfig(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateDoctorDto,
  ) {
    return this.doctorsService.updateConfig(userId, dto);
  }

  //---Endpoint para agregar disponibilidad horaria---
  @Post('availability')
  @ApiOperation({ summary: 'Agregar disponibilidad horaria' })
  addAvailability(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.doctorsService.addAvailability(userId, dto);
  }

  //---Endpoint para bloquear dias (vacaciones)---
  @Post('override')
  @ApiOperation({ summary: 'Adicionar dias no laborales' })
  addOverride(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateOverrideDto,
  ) {
    return this.doctorsService.addOverride(userId, dto);
  }
}