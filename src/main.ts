import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import path, { join } from 'path';
import express from 'express';

console.log( join(__dirname, '..', '/src/emailTemplates'))
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configurar Express para servir archivos estáticos

  // app.use(express.static(path.join()));

  
  app.enableCors();
  // restriccion de los datos inexistentes desde el frontend
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  await app.listen(3000);
}
bootstrap();
