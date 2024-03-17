import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './entities/publicacione.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Like, LikeSchema } from './entities/likes.entity';


@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema},
      { name: Like.name, schema: LikeSchema},
    ]),
    AuthModule
    

  ]
})
export class PublicacionesModule {}
