import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  //Se levanta el servidor
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
