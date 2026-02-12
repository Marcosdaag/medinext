import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //Se crea el modulo contenedor de toda la app
  const app = await NestFactory.create(AppModule);
  
  //Configuracion de swagger
  const config = new DocumentBuilder()
  .setTitle('Medinext API')
  .setDescription('Documentacion de la API de Medinext')
  .setVersion('1.0')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Validacion global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //elimina datos extra que no esten en el dto para mas seguridad
    forbidNonWhitelisted: true, //genera un error si se envian datos de mas
    transform: true, //transforma los datos automaticamente
  }));

  //Se levanta el servidor
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
