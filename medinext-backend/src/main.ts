import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

//Importar swagger para documentacion "npm install --save @nestjs/swagger"
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Medinext API 🏥')
    .setDescription('Gestión integral e inteligente para entidades de salud. Incluye gestión de turnos, médicos y pacientes.')
    .setVersion('1.0')
    // Con esto puedo agrupar endpoints por etiquetas .addTag('doctors')
    .addBearerAuth() // Esto permite probar rutas protegidas con JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Establecemos la ruta de la documentación "http://localhost:3000/documentation"
  SwaggerModule.setup('documentation', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
