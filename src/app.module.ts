import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';





@Module({
  imports: [

    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),

    //static files
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, "..", 'static/templates'),   // <-- path to the static files
    // }),

    AuthModule,

    FilesModule,

    PublicacionesModule,
    //Mailer service
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: "msilvarubios3@gmail.com",
          pass: "bzfshphqkufvqdwo"
        }
      },
      defaults: {
        from: '"Red Social" <adminproject@buisness.com>',
      },
      template: {
        dir: join(__dirname, '..', '/src/emailTemplates'),
        options: {
          strict: true,
        },
      },
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'static/products'), // Ruta a la carpeta de archivos estáticos (por ejemplo, 'uploads')
    // }),
  
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
