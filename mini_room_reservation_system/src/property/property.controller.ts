import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { RolesCanAccess } from 'src/auth/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';
import { IsPublic } from 'src/auth/decorators/public.decorator';
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
  findAll() {
    return this.propertyService.findAll();
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
  ) {
    return this.propertyService.update(+id, updatePropertyDto);
  }
  @RolesCanAccess([Role.ADMIN, Role.OWNER])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(+id);
  }
}
