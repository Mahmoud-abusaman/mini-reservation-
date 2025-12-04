import { Injectable, UnauthorizedException } from '@nestjs/common';

import { PrismaService } from 'src/database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'generated/prisma/enums';
import { ActiveUserData } from './interfaces/active-user-data.interface';
import { User } from 'generated/prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerDTO: RegisterDto) {
    const hashedPassword = await this.hashPassword(registerDTO.password);
    const createdUser = (await this.prismaService.user.create({
      data: {
        ...registerDTO,
        password: hashedPassword,
      },
      omit: { password: true },
    })) as Omit<User, 'password'>;

    const token = this.generateJwtToken(
      createdUser.id,
      createdUser.role,
      createdUser.email,
    );

    return {
      user: createdUser,
      token,
    };
  }

  async login(loginDTO: LoginDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email: loginDTO.email,
      },
    });
    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(
      loginDTO.password,
      foundUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.generateJwtToken(
      foundUser.id,
      foundUser.role,
      foundUser.email,
    );
    return {
      token,
    };
  }

  private hashPassword(password: string) {
    return argon.hash(password);
  }

  private verifyPassword(password: string, hashedPassword: string) {
    return argon.verify(hashedPassword, password);
  }

  private generateJwtToken(userId: number, role: Role, email: string) {
    return this.jwtService.sign({ id: userId, role, email } as ActiveUserData, {
      expiresIn: '30d',
    });
  }
}
