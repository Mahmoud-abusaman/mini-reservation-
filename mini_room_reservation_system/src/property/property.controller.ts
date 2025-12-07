import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { RolesCanAccess } from 'src/auth/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { IsPublic } from 'src/auth/decorators/public.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { QueryPropertyDto } from './dto/query.dto';
@IsPublic(false)
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @RolesCanAccess([Role.ADMIN, Role.OWNER])
  @Post()
  create(
    @Body() createPropertyDto: CreatePropertyDto,
    @ActiveUser('id') ownerId: number,
  ) {
    return this.propertyService.create(createPropertyDto, ownerId);
  }

  @IsPublic(true)
  @Get()
  findAll(@Query() query: QueryPropertyDto) {
    return this.propertyService.findAll(query);
  }

  @IsPublic(true)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(+id);
  }

  @RolesCanAccess([Role.ADMIN, Role.OWNER])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @ActiveUser() owner: ActiveUserData,
  ) {
    return this.propertyService.update(
      +id,
      updatePropertyDto,
      owner.id,
      owner.role,
    );
  }

  @RolesCanAccess([Role.ADMIN, Role.OWNER])
  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() owner: ActiveUserData) {
    return this.propertyService.remove(+id, owner.id, owner.role);
  }
}
