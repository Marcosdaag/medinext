import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  //---1 Se crea el modulo contenedor de toda la app---
  const app = await NestFactory.create(AppModule);

  //---Aumento de limite de subida en una misma peticion---
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  //---2 Configuracion de swagger---
  const config = new DocumentBuilder()
    .setTitle('Medinext App')
    .setDescription('Documentacion de API medica.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //---3 Validacion global---
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //elimina datos extra que no esten en el dto para mas seguridad
    forbidNonWhitelisted: true, //genera un error si se envian datos de mas
    transform: true, //transforma los datos automaticamente
  }));

  //Se levanta el servidor
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
