import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateOverrideDto } from './dto/create-override.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DOCTOR')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  //---Endpoing para completar el perfil inicial---
  @Post('profile')
  create(@Request() req, @Body() dto: CreateDoctorDto) {
    return this.doctorsService.createProfile(req.user.sub, dto);
  }

  //---Endpoing para ver informacion completa---
  @Get('me')
  getMe(@Request() req) {
    return this.doctorsService.getMyProfile(req.user.sub);
  }

  //---Endpoing para cambiar precio y duracion de los turnos---
  @Patch('config')
  updateConfig(@Request() req, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.updateConfig(req.user.sub, dto);
  }

  //---Endpoing para agregar disponibilidad horaria---
  @Post('availability')
  addAvailability(@Request() req, @Body() dto: CreateAvailabilityDto) {
    return this.doctorsService.addAvailability(req.user.sub, dto);
  }

  //---Endpoing para bloquear dias (vacaciones)---
  @Post('override')
  addOverride(@Request() req, @Body() dto: CreateOverrideDto) {
    return this.doctorsService.addOverride(req.user.sub, dto);
  }
}
