import { Controller, Get, Post, Body, Param, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { EmailService } from './email.service';
import { Response } from 'express';


@Controller('authorization')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly emailService: EmailService
    ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  //login endpoint
  @Post("/login")
  login(@Body() loginDto: LoginUserDto){
    
    return this.authService.login(loginDto )
  }

  @Post("/register")
  register(@Body() registerDto: RegisterUserDto){
    return this.authService.register( registerDto)
  }

  @UseGuards( AuthGuard)
  @Get()
  findAll( @Request() req: Request) {
    
    const user = req["user"];
    // console.log(user)

    //reconstruir el usuario con el id

    return user;
  }

  @UseGuards( AuthGuard)
  @Get("/check-token")
  checkToken(@Request() req: Request){

    const user = req["user"] as User;

    return {
      user,
      token: this.authService.getJwtToken({ id: user._id}, "3h")
    }
  }

  @Get("/validate-email/:token")
  public async validateEmailFromRegister(@Param() token: string,
  @Res() res: Response
  ){
    const htmlFile = await this.authService.validateEmail( token);
    res.sendFile(htmlFile);
  }

}
