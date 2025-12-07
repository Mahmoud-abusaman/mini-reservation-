import { OmitType, PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from 'src/auth/dto/register.dto';
export class UpdateUserDto extends PartialType(RegisterDto) {}

export class UpdateMeDto extends PartialType(OmitType(RegisterDto, ['role'])) {}
