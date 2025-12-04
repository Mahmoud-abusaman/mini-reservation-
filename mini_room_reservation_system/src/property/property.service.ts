import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class PropertyService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createPropertyDto: CreatePropertyDto, ownerId: number) {
    return this.prismaService.property.create({
      data: { ...createPropertyDto, ownerId },
    });
  }

  findAll() {
    return this.prismaService.property.findMany();
  }

  findOne(id: number) {
    return this.prismaService.property.findUnique({
      where: { id },
    });
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return this.prismaService.property.update({
      where: { id },
      data: updatePropertyDto,
    });
  }

  remove(id: number) {
    return this.prismaService.property.delete({
      where: { id },
    });
  }
}
