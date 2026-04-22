import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { UserController } from './presentation/controllers/user.controller';
import { ChaosController } from './presentation/controllers/chaos.controller';
import { AppService } from './app.service';
import { UserService } from './application/services/user.service';
import { ChaosEngineService } from './application/services/chaos-engine.service';
import { AiServiceClient } from './infrastructure/external/ai-service.client';
import { User } from './domain/entities/user.entity';
import { ChaosLog } from './domain/entities/chaos-log.entity';
import { TypeOrmUserRepository } from './infrastructure/repositories/user.repository';
import { TypeOrmChaosRepository } from './infrastructure/repositories/chaos.repository';
import { LatencyStrategy } from './infrastructure/strategies/latency.strategy';
import { Error500Strategy } from './infrastructure/strategies/error500.strategy';
import { ChaosInterceptor } from './presentation/interceptors/chaos.interceptor';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: 5432,
      username: process.env.DB_USER || 'resiliengine_user',
      password: process.env.DB_PASSWORD || 'password123',
      database: process.env.DB_NAME || 'resiliengine_db',
      entities: [User, ChaosLog],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, ChaosLog]),
  ],
  controllers: [AppController, UserController, ChaosController],
  providers: [
    AppService,
    UserService,
    ChaosEngineService,
    AiServiceClient,
    LatencyStrategy,
    Error500Strategy,
    { provide: 'IUserRepository', useClass: TypeOrmUserRepository },
    { provide: 'IChaosRepository', useClass: TypeOrmChaosRepository },
    { provide: APP_INTERCEPTOR, useClass: ChaosInterceptor },
  ],
})
export class AppModule {}
