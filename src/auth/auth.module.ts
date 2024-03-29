import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

@Module({
 
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  imports:[

  ConfigModule.forRoot(),
 
    MongooseModule.forFeature( [
      { name: User.name, schema: UserSchema}
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      // signOptions: { expiresIn: '3h' }
    }),
  ],

  exports:[
    AuthService,
    MongooseModule
  ]
})
export class AuthModule {}
