import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env dosyasını kök dizinden yükle
dotenv.config({ path: path.join(__dirname, '../../.env') });
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
import { Error429Strategy } from './infrastructure/strategies/error429.strategy';
import { Error401Strategy } from './infrastructure/strategies/error401.strategy';
import { ChaosInterceptor } from './presentation/interceptors/chaos.interceptor';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      // DATABASE_URL varsa onu kullan (Render veya .env), yoksa yerel config
      url:
        process.env.DATABASE_URL ||
        `postgresql://resiliengine_user:${process.env.DB_PASSWORD || 'password123'}@localhost:5432/resiliengine_db`,

      entities: [User, ChaosLog],
      synchronize: true,
      // Render veritabanına dışarıdan veya Render içinden bağlanırken SSL gereklidir
      ssl:
        process.env.DATABASE_URL &&
        (process.env.DATABASE_URL.includes('render.com') || process.env.DATABASE_URL.includes('frankfurt-postgres'))
          ? { rejectUnauthorized: false }
          : false,
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
    Error429Strategy,
    Error401Strategy,
    { provide: 'IUserRepository', useClass: TypeOrmUserRepository },
    { provide: 'IChaosRepository', useClass: TypeOrmChaosRepository },
    { provide: APP_INTERCEPTOR, useClass: ChaosInterceptor },
  ],
})
export class AppModule { }
