import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
// import { removeFields } from 'src/utils/object.util';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/database/database.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { IsPublic } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IsPublic, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const jwt = authHeader?.split(' ')[1];
    if (!jwt) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwtService.verify<ActiveUserData>(jwt);

      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { id: payload.id },
      });
      // attach user to request
      request.user = {
        email: user.email,
        role: user.role,
        id: user.id,
      } as ActiveUserData;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
