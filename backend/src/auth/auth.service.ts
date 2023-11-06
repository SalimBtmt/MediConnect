import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from 'src/doctor/schemas/doctor.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Doctor.name) //
    private doctorModel: Model<Doctor>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto): Promise<{ token: string }> {
    const { firstname, lastname, username, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await this.doctorModel.create({
      firstname,
      lastname,
      username,
      password: hashedPassword,
    });

    delete doctor.password;

    const token = this.jwtService.sign({ id: doctor._id });

    return { token };
  }

  async signIn(username, pass) {
    const user = await this.doctorModel.findOne({ username });
  
    if (!user) {
      throw new UnauthorizedException();
    }
  
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }
  
    const payload = { id: user.id, username: user.username }; // sub should be used for the user's ID
  
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
  

  /* async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const { username, password } = signInDto;

    const user = await this.doctorModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  } */

  async findOneById(id: string): Promise<Doctor> {
    // Remove password from the user
    return this.doctorModel.findById(id).select('-password').exec();
  }
}
