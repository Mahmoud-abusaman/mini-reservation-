import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class ReservationService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createReservationDto: CreateReservationDto, reserverId: number) {
    return this.prismaService.reservation.create({
      data: {
        ...createReservationDto,
        reserverId,
      },
    });
  }

  findAll() {
    return this.prismaService.reservation.findMany();
  }

  findOne(id: number) {
    return this.prismaService.reservation.findUnique({
      where: { id },
    });
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservation.update({
      where: { id },
      data: updateReservationDto,
    });
  }

  remove(id: number) {
    return this.prismaService.reservation.delete({
      where: { id },
    });
  }
}
