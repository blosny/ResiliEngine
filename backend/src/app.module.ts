import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ChaosLog } from './domain/entities/chaos-log.entity';
import { ChaosEngineService } from './application/services/chaos-engine.service';
import { TypeOrmChaosRepository } from './infrastructure/repositories/chaos.repository';
import { AiServiceClient } from './infrastructure/external/ai-service.client';
import { LatencyStrategy } from './infrastructure/strategies/latency.strategy';
import { Error500Strategy } from './infrastructure/strategies/error500.strategy';
import { ChaosController } from './presentation/controllers/chaos.controller';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
<<<<<<< HEAD
      url:
        process.env.DATABASE_URL ||
        'postgresql://resiliengine_user:password123@db:5432/resiliengine_db',
      entities: [ChaosLog],
      synchronize: true,
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
=======
      host: process.env.DB_HOST || 'db',
      port: 5432,
      username: 'resiliengine_user',
      password: 'password123',
      database: 'resiliengine_db',
      entities: [ChaosLog],
      synchronize: true,
>>>>>>> develop
    }),
    TypeOrmModule.forFeature([ChaosLog]),
  ],
  controllers: [ChaosController],
  providers: [
    ChaosEngineService,
    AiServiceClient,
    LatencyStrategy,
    Error500Strategy,
<<<<<<< HEAD
    {
      provide: 'IChaosRepository',
      useClass: TypeOrmChaosRepository,
    },
=======
    { provide: 'IChaosRepository', useClass: TypeOrmChaosRepository }, // KRİTİK: Interface Mapping
>>>>>>> develop
  ],
})
export class AppModule {}
