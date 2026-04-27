import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { APP_INTERCEPTOR } from '@nestjs/core';

// Kontrolcüler
import { AppController } from './app.controller';
import { UserController } from './presentation/controllers/user.controller';
import { ChaosController } from './presentation/controllers/chaos.controller';

// Servisler
import { AppService } from './app.service';
import { UserService } from './application/services/user.service';
import { ChaosEngineService } from './application/services/chaos-engine.service';
import { AiServiceClient } from './infrastructure/external/ai-service.client';
import { TerminalMonitorService } from './infrastructure/services/terminal-monitor.service'; // SCRUM-36
import { PathExtractorService } from './infrastructure/services/path-extractor.service'; // SCRUM-37

// Altyapı ve Veritabanı
import { User } from './domain/entities/user.entity';
import { ChaosLog } from './domain/entities/chaos-log.entity';
import { TypeOrmUserRepository } from './infrastructure/repositories/user.repository';
import { TypeOrmChaosRepository } from './infrastructure/repositories/chaos.repository';

// Stratejiler
import { LatencyStrategy } from './infrastructure/strategies/latency.strategy';
import { Error500Strategy } from './infrastructure/strategies/error500.strategy';
import { Error429Strategy } from './infrastructure/strategies/error429.strategy';
import { Error401Strategy } from './infrastructure/strategies/error401.strategy';

// Interceptor
import { ChaosInterceptor } from './presentation/interceptors/chaos.interceptor';

function parseBool(value: string | undefined) {
  if (!value) return false;
  return value === '1' || value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
}

function parseTriBool(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === '') return undefined;
  return parseBool(value);
}

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const databaseUrl = process.env.DATABASE_URL;
        const runningOnRender = !!process.env.RENDER;
        const sslEnabled = parseTriBool(process.env.DB_SSL) ?? runningOnRender;
        const ssl = sslEnabled
          ? { rejectUnauthorized: parseBool(process.env.DB_SSL_REJECT_UNAUTHORIZED) }
          : false;

        const base = {
          type: 'postgres' as const,
          entities: [User, ChaosLog],
          synchronize: true,
        };

        // Render gibi platformlarda genelde tek değişkenle (DATABASE_URL) bağlantı kurulur.
        // `url` ile `host/port/user/pass` aynı anda verilirse yanlış/çakışan config oluşabiliyor.
        if (databaseUrl) {
          return {
            ...base,
            url: databaseUrl,
            ssl,
            extra: ssl ? { ssl } : undefined,
          };
        }

        return {
          ...base,
          host: process.env.DB_HOST || 'db',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USER || 'resiliengine_user',
          password: process.env.DB_PASSWORD || 'password123',
          database: process.env.DB_NAME || 'resiliengine_db',
          ssl,
          extra: ssl ? { ssl } : undefined,
        };
      },
    }),
    TypeOrmModule.forFeature([User, ChaosLog]),
  ],
  controllers: [AppController, UserController, ChaosController],
  providers: [
    AppService,
    UserService,
    ChaosEngineService,
    AiServiceClient,
    TerminalMonitorService, // SCRUM-36
    PathExtractorService, // SCRUM-37
    LatencyStrategy,
    Error500Strategy,
    Error429Strategy,
    Error401Strategy,
    { provide: 'IUserRepository', useClass: TypeOrmUserRepository },
    { provide: 'IChaosRepository', useClass: TypeOrmChaosRepository },
    { provide: APP_INTERCEPTOR, useClass: ChaosInterceptor },
  ],
})
export class AppModule {}
