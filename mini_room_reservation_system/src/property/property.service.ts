import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/database/database.service';
import { NotFoundError } from 'rxjs';
import { Role } from 'generated/prisma/enums';
import { QueryPropertyDto } from './dto/query.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PropertyService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createPropertyDto: CreatePropertyDto, ownerId: number) {
    return this.prismaService.property.create({
      data: { ...createPropertyDto, ownerId },
    });
  }

  findAll(query: QueryPropertyDto) {
    const prismaQuery = this.buildPrismaQuery(query);
    return this.prismaService.property.findMany(prismaQuery);
  }

  findOne(id: number) {
    return this.prismaService.property.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
    ownerId: number,
    ownerRole: Role,
  ) {
    const property = await this.prismaService.property.findUnique({
      where: { id },
    });
    if (!property) {
      throw new NotFoundException('Property not found.');
    }
    if (property.ownerId !== ownerId && ownerRole !== Role.ADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to update this property.',
      );
    }
    return this.prismaService.property.update({
      where: { id },
      data: updatePropertyDto,
    });
  }

  async remove(id: number, ownerId: number, ownerRole: Role) {
    const property = await this.prismaService.property.findUnique({
      where: { id },
    });
    if (!property) {
      throw new NotFoundException('Property not found.');
    }
    if (property.ownerId !== ownerId && ownerRole !== Role.ADMIN) {
      throw new Error('You do not have permission to delete this property.');
    }
    return this.prismaService.property.delete({
      where: { id },
    });
  }

  buildPrismaQuery(dto: QueryPropertyDto): Prisma.PropertyFindManyArgs {
    const where: Prisma.PropertyWhereInput = {};
    const orderBy: Prisma.PropertyOrderByWithRelationInput[] = [];

    if (dto.search) {
      where.name = { contains: dto.search, mode: 'insensitive' };
    }

    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      where.pricePerDay = {};
      if (dto.minPrice !== undefined) where.pricePerDay.gte = dto.minPrice;
      if (dto.maxPrice !== undefined) where.pricePerDay.lte = dto.maxPrice;
    }

    // --- Availability filter ---
    if (dto.available !== undefined) {
      where.status = dto.available;
    }

    // --- Sorting ---
    if (dto.sortBy) {
      switch (dto.sortBy) {
        case 'price':
          orderBy.push({ pricePerDay: 'asc' });
          break;
        case 'name':
          orderBy.push({ name: 'asc' });
          break;
        case 'createdAt':
          orderBy.push({ createdAt: 'desc' });
          break;
      }
    }

    // --- Pagination ---
    const take = dto.limit ?? 20; // default limit
    const skip = dto.offset ?? 0;

    // --- Build final query ---
    const query: Prisma.PropertyFindManyArgs = {
      where,
      orderBy: orderBy.length ? orderBy : undefined,
      take,
      skip,
    };

    return query;
  }
}
