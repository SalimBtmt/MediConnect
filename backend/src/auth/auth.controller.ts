import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: any,
  ): Promise<{ token: string }> {
    response.setCookie(
      'jwt',
      (await this.authService.signIn(signInDto)).token,
      {
        httpOnly: true,
      },
    );

    return this.authService.signIn(signInDto);
    //return {
    //  message: "success"
    //};
  }

  @Get('/doctor')
  async doctor(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException('JWT verification failed');
      }

      const doctor = await this.authService.findOneById(data.id);
      return doctor;
    } catch (e) {
      console.error('Error:', e);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: any) {
    response.setCookie('jwt', '', { expires: new Date(0) });
    return {
      message: 'success',
    };
  }
}
