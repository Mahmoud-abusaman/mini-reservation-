import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoomStatus } from 'generated/prisma/enums';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  pricePerDay: number;

  @IsNotEmpty()
  @IsInt()
  capacity: number;

  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status: RoomStatus;
  //   location: string;
}
