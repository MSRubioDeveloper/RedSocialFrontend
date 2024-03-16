import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';

// encriptar contraseñas
import * as bcryptsjs from "bcryptjs"
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { loginResponse } from './interfaces/login-response';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from './email.service';
import { registerTemplate } from 'src/email/helpers/templates';
import { EmailOptions } from 'src/email/interfaces/email-options.interface';
import { join } from 'path';




@Injectable()
export class AuthService {

  constructor(
     @InjectModel(User.name) private userModel: Model<User>,
     private jwtservice: JwtService,
     private emailService: EmailService
  ){

  }


  async create(createUserDto: CreateUserDto): Promise<loginResponse> {
    try{

        //1.- encriptar contraseñas (byscriptjs)
        const { password, ...userData} =createUserDto;
       //2.- guardar el usuario
        const newUser = new this.userModel({
          password: bcryptsjs.hashSync( password, 10),
          ...userData
        })
        //3.- generar JWT
         const { password:_ , ...user} = newUser.toJSON();

         //3. Mandamos el link de activacion de cuenta 
        const token = await this.getJwtToken({id: user._id}, "15m");
        await newUser.save();

         const url = `${ process.env.WEBSERVICE}/authorization/validate-email/${token}`
         const emailOptions: EmailOptions = {
          to: user.email,
          subject: "Red Social - Verficacion",
          html: `
              <h1> Bienvenido! </h1>
            
              <p> Para poder validar tu cuenta, porfavor haz click en el siguiente
              enlace, la validez del token tiene 15 minutos </p>
          
              <a href="${url}"> Validar tu email  </a>
          `
         };
          const emailsended = await this.emailService.sendEmailVerification( emailOptions );
          if( !emailsended ) throw new InternalServerErrorException("Email no enviado - verifica el Email ingresado");


          return {
            user: user,
            token: token
          }
        //  return user;
      
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

      const { user, token } = await this.create( registerDto);

      return {
        user: user,
        token: token
      }
   
    
  }

  async login(loginDto: LoginUserDto): Promise<loginResponse>{
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email})

  
      if( !user ){
        throw new UnauthorizedException("Not Valid Credentials");
      }
      if( !bcryptsjs.compareSync(password, user.password)){
        throw new UnauthorizedException("Not Valid Credentials");
      }

      if( user.isActive === false ){
        throw new UnauthorizedException("Cuenta No validada, revisa tu correo electronico")
      }


      const {password:_, ...rest} = user.toJSON();

      return{
        user: rest,
        token: this.getJwtToken({ id: user.id }, "15m")
      }
  }

  //JWT 
  getJwtToken( payload: JwtPayload, expiresIn: string ){
    const token = this.jwtservice.sign(payload, { expiresIn: expiresIn});
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


  async findUserByEmail(email: string){
    const user = await this.userModel.findOne({ email })

    return user;
  }


  public async validateEmail( token: any ){
    console.log(token)  
    
    const payload = await this.jwtservice.verify( token.token );
    if( !payload ){

      throw new UnauthorizedException("Invalid token");
    }
    if( !payload.id ) throw new InternalServerErrorException("id is not in token")
    console.log( payload.id)
    const user = await this.userModel.findOne({ _id: payload.id});
    user.isActive = true;
    await user.save();

    //retornar template
    const htmlFilePath = join(__dirname, '../..', 'static/templates/validacionEmailExitosa.html');
    return  htmlFilePath;
  }


  //TODO Que pasa si el usuario excede los 15 minutos?
  // deberia haber un metodo de renviar la verificacion! :)
  // public reSendEmail(token: string, email: string){
  //   const url = `${ process.env.WEBSERVICE}/authorization/validate-email/${token}`
  //   const emailOptions: EmailOptions = {
  //    to: email,
  //    subject: "Red Social - Verficacion",
  //    html: `
  //        <h1> Bienvenido! </h1>
       
  //        <p> Para poder validar tu cuenta, porfavor haz click en el siguiente
  //        enlace, la validez del token tiene 15 minutos </p>
     
  //        <a href="${url}"> Validar tu email  </a>
  //    `
  //   };


}

