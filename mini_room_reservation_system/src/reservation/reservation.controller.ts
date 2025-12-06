import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { IsPublic } from 'src/auth/decorators/public.decorator';
import { RolesCanAccess } from 'src/auth/decorators/roles.decorator';
import { Role } from 'generated/prisma/client';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
@IsPublic(false)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @ActiveUser('id') userId: number,
  ) {
    return this.reservationService.create(createReservationDto, userId);
  }

  @RolesCanAccess([Role.ADMIN, Role.OWNER])
  @Get()
  findAll(
    @ActiveUser('id') userId: number,
    @ActiveUser('role') userRole: Role,
  ) {
    return this.reservationService.findAll(userId, userRole);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.reservationService.findOne(+id, user.id, user.role);
  }

  @Patch('cancel/:id')
  cancelReservation(@Param('id') id: string) {
    this.reservationService.update(+id, { status: 'CANCELLED' });
    return this.remove(id, { id: 1, role: Role.ADMIN, email: 'string' });
  }
  @RolesCanAccess([Role.ADMIN])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.reservationService.remove(+id, user.id, user.role);
  }
}
