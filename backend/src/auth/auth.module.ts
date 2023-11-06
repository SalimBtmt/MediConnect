import { Module } from '@nestjs/common';
import * as Config from 'config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guards';
import { JwtStrategy } from './jwt.strategy';
import { DoctorSchema } from './../doctor/schemas/doctor.schema';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: Config.get<string>('jwt.secret'),
      signOptions: { expiresIn: '3d' },
    }),
    MongooseModule.forFeature([{ name: 'Doctor', schema: DoctorSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
  exports: [JwtStrategy,PassportModule],
})
export class AuthModule {}
