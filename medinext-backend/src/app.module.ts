import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    //Esto carga el archivo .env para que toda la app lo pueda leer
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, //60k milisegundos = 60 segundos
      limit: 5 //cantidad de peticiones permitidas en ese lapso de tiempo
    }]),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
