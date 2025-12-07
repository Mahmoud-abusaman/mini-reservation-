import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { PropertyModule } from './property/property.module';
import { ReservationModule } from './reservation/reservation.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
} from './exceptions/exception';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    PropertyModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [
    { provide: 'APP_GUARD', useClass: AuthGuard },
    { provide: 'APP_GUARD', useClass: RolesGuard },
    { provide: 'APP_INTERCEPTOR', useClass: ResponseInterceptor },
    // { provide: 'APP_FILTER', useClass: HttpExceptionFilter },
    // { provide: 'APP_FILTER', useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}
