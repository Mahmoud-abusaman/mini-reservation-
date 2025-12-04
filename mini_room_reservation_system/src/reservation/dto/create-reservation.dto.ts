import { IsDate, IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { BookingStatus } from 'generated/prisma/enums';

export class CreateReservationDto {
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @IsNotEmpty()
  @IsDate()
  checkIn: Date;

  @IsNotEmpty()
  @IsDate()
  checkOut: Date;

  @IsEnum(BookingStatus)
  status: BookingStatus = BookingStatus.PENDING;
}
