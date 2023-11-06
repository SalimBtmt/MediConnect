import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as Config from 'config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Doctor } from './../doctor/schemas/doctor.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(
    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Config.get<string>('jwt.secret'),
    });
  }

  async validate(payload) {
    const { id } = payload;

    const doctor = await this.doctorModel.findById(id);

    if (!doctor) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    return doctor;
  }
}