import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './entities/publicacione.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema},

    ]),
    AuthModule
    

  ]
})
export class PublicacionesModule {}
