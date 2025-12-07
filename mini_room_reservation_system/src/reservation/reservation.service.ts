import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/database/database.service';
import { Role } from 'generated/prisma/enums';

@Injectable()
export class ReservationService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createReservationDto: CreateReservationDto, reserverId: number) {
    const { roomId, checkIn, checkOut } = createReservationDto;
    const room = await this.prismaService.property.findUnique({
      where: { id: roomId },
    });
    if (!room) throw new NotFoundException('this room is not available');

    if (await this.hasOverlap(roomId, checkIn, checkOut)) {
      throw new BadRequestException(
        'This room is already booked for the selected dates.',
      );
    }
    return this.prismaService.reservation.create({
      data: {
        ...createReservationDto,
        reserverId,
      },
    });
  }

  findAll(userId: number, userRole: Role) {
    if (userRole == Role.ADMIN)
      return this.prismaService.reservation.findMany();

    return this.prismaService.reservation.findMany({
      where: {
        room: {
          ownerId: userId,
        },
      },
      include: { room: true },
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const reservation = await this.prismaService.reservation.findUnique({
      where: { id },
      include: { room: true },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (
      (userRole == Role.GUEST && reservation.reserverId != userId) ||
      (userRole != Role.OWNER && reservation.room.ownerId != userId)
    )
      throw new UnauthorizedException('Unauthorized');
    return reservation;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.prismaService.reservation.update({
      where: { id },
      data: updateReservationDto,
    });
  }

  async remove(id: number, userId: number, userRole: Role) {
    const reservation = await this.prismaService.reservation.findUnique({
      where: { id },
    });
    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }
    if (userRole != Role.ADMIN && reservation.reserverId != userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.prismaService.reservation.delete({
      where: { id },
    });
  }
  async hasOverlap(roomId: number, startDate: Date, endDate: Date) {
    return !!(await this.prismaService.reservation.findFirst({
      where: {
        roomId,
        checkIn: { lte: endDate },
        checkOut: { gte: startDate },
      },
    }));
  }
}
