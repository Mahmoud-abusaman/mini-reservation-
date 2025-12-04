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
  @RolesCanAccess([Role.ADMIN])
  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }
  @RolesCanAccess([Role.ADMIN, Role.OWNER])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
