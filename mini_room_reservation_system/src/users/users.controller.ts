import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateMeDto, UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from 'src/auth/decorators/public.decorator';
import { RolesCanAccess } from 'src/auth/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { type ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
@IsPublic(false)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@ActiveUser('id') userId: number) {
    return this.usersService.findOne(userId);
  }

  @RolesCanAccess([Role.ADMIN])
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @IsPublic(true)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  @Patch('me')
  updateMe(
    @Body() updateUserDto: UpdateMeDto,
    @ActiveUser('id') userId: number,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }
  @RolesCanAccess([Role.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete('me')
  removeMe(@ActiveUser('id') userId: number) {
    return this.usersService.remove(userId);
  }

  @RolesCanAccess([Role.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.usersService.remove(+id);
  }
}
