import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';


@Module({
  imports: [

    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),

    AuthModule,

    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
