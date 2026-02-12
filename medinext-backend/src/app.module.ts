import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    //Esto carga el archivo .env para que toda la app lo pueda leer
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
