import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; // SCRUM-11: AI Entegrasyonu için şart
import { APP_INTERCEPTOR } from '@nestjs/core'; // Global Interceptor için şart

// Kontrolcüler (Presentation Layer)
import { AppController } from './app.controller';
import { UserController } from './presentation/controllers/user.controller';
import { ChaosController } from './presentation/controllers/chaos.controller';

// Servisler (Application Layer)
import { AppService } from './app.service';
import { UserService } from './application/services/user.service';
import { ChaosEngineService } from './application/services/chaos-engine.service';
import { AiServiceClient } from './infrastructure/external/ai-service.client';

// Altyapı ve Veritabanı (Infrastructure Layer)
import { User } from './domain/entities/user.entity';
import { ChaosLog } from './domain/entities/chaos-log.entity';
import { TypeOrmUserRepository } from './infrastructure/repositories/user.repository';
import { TypeOrmChaosRepository } from './infrastructure/repositories/chaos.repository';

// Stratejiler (Strategy Pattern)
import { LatencyStrategy } from './infrastructure/strategies/latency.strategy';
import { Error500Strategy } from './infrastructure/strategies/error500.strategy';

// Interceptor
import { ChaosInterceptor } from './presentation/interceptors/chaos.interceptor';

@Module({
  imports: [
    // SCRUM-11: Tunahan'ın AI servisine istek atabilmek için gerekli modül
    HttpModule,

    // Veritabanı Yapılandırması (Taha'nın Docker ayarlarıyla %100 uyumlu)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: 5432,
      username: process.env.DB_USER || 'resiliengine_user',
      password: process.env.DB_PASSWORD || 'password123',
      database: process.env.DB_NAME || 'resiliengine_db',
      entities: [User, ChaosLog], // ChaosLog eklendi (Stage 4 History için)
      synchronize: true, // Geliştirme aşamasında true kalsın
    }),

    // Entity'leri modüle tanıtıyoruz
    TypeOrmModule.forFeature([User, ChaosLog]),
  ],
  controllers: [
    AppController,
    UserController,
    ChaosController, // Chaos History ve Trigger endpointleri burada
  ],
  providers: [
    AppService,
    UserService,
    ChaosEngineService,
    AiServiceClient,

    // STRATEGY PATTERN: Stratejileri Dependency Injection (DI) için kaydediyoruz
    LatencyStrategy,
    Error500Strategy,

    // REPOSITORY PATTERN (Hocanın PDF Madde 2 kuralı):
    // Servislerde interface kullanıp, burada gerçek sınıfı bağlıyoruz.
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'IChaosRepository',
      useClass: TypeOrmChaosRepository,
    },

    // CHAOS INTERCEPTOR: Kaos etkilerini tüm sistemde otomatik aktif eder
    {
      provide: APP_INTERCEPTOR,
      useClass: ChaosInterceptor,
    },
  ],
})
export class AppModule {}
