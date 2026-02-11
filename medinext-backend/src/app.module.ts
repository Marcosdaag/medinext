import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';

@Module({
  imports: [
    //Esto carga el archivo .env para que toda la app lo pueda leer
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
