// Importe el cliente prisma para que se ejectute al iniciar la aplicacion y pueda comunicarse con la db
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    async onModuleInit() {
        await this.$connect();
    }
}
