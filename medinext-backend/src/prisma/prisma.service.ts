import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // Se conecta apenas arranca la app
    async onModuleInit() {
        await this.$connect();
    }

    // Se desconecta prolijamente cuando apagas la app
    async onModuleDestroy() {
        await this.$disconnect();
    }
}