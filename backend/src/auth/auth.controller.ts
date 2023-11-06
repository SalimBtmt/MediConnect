import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from './auth.guards';
import { Public } from './auth.guards';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Public()
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: Record<string, any>) {
    return await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
  }

  /* async signIn(
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
  } */

  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user;
  }

  @Public()
  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: any) {
    response.setCookie('jwt', '', { expires: new Date(0) });
    response.setCookie('token', '', { expires: new Date(0) });
    return {
      message: 'success',
    };
  }
}
