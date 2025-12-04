import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from 'generated/prisma/enums';

export class UpdateReservationDto {
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus = BookingStatus.PENDING;
}
