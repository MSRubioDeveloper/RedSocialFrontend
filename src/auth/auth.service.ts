import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

// encriptar contraseñas
import * as bcryptsjs from "bcryptjs"
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { loginResponse } from './interfaces/login-response';
import { RegisterUserDto } from './dto/register-user.dto';



@Injectable()
export class AuthService {

  constructor(
     @InjectModel(User.name) private userModel: Model<User>,
     private jwtservice: JwtService
  ){

  }


  async create(createUserDto: CreateUserDto): Promise<User> {
    try{
        //1.- encriptar contraseñas (byscriptjs)
        const { password, ...userData} =createUserDto;
       //2.- guardar el usuario
        const newUser = new this.userModel({
          password: bcryptsjs.hashSync( password, 10),
          ...userData
        })
        //3.- generar JWT
        
         await newUser.save();
         const { password:_ , ...user} = newUser.toJSON();

         return user;
      
    }catch(error){
      console.log(error.code)
      // 11000 == email dublicado
      if(error.code == 11000){
        throw new BadRequestException(`${ createUserDto.email } ya existe`)
      }
      throw new InternalServerErrorException("Algo salio mal")
     
    }

  }

  // !TODO: 
  async register( registerDto: RegisterUserDto): Promise<loginResponse>{
    //procedimiento de registro de usuario
    //usar create() Y RETURN Login response

    const user = await this.create( registerDto)

    return {
      user: user,
      token: this.getJwtToken({id: user._id})
    }
  }

  async login(loginDto: LoginUserDto): Promise<loginResponse>{
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email})

      if( !user ){
        throw new UnauthorizedException("Not Valid Credentials - email")
      }
      if( !bcryptsjs.compareSync(password, user.password)){
        throw new UnauthorizedException("Not Valid Credentials - password")
      }

      const {password:_, ...rest} = user.toJSON();

      return{
        user: rest,
        token: this.getJwtToken({ id: user.id })
      }
  }

  //JWT 
  getJwtToken( payload: JwtPayload ){
    const token = this.jwtservice.sign(payload);
    return token;
  }



  
  findAll(): Promise<User[]> {
    return this.userModel.find();
  }


  async findUserById( id: string ){
    const user = await this.userModel.findById( id )
    const { password, ...rest}  = user.toJSON();
    return rest;
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
