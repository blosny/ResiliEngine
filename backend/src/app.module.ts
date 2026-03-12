import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core'; // Global interceptor için şart
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 1. Entity (Tablo) Import
import { User } from './domain/entities/user.entity';

// 2. Repository (Veri Erişimi) Import
import { UserRepository } from './infrastructure/repositories/user.repository';

// 3. Service (İş Mantığı) Importlar
import { UserService } from './application/services/user.service';
import { ChaosEngineService } from './application/services/chaos-engine.service';

// 4. Controller (API Uçları) Importlar
import { UserController } from './presentation/controllers/user.controller';

// 5. Interceptor (Kaos Tetikleyici) Import
import { ChaosInterceptor } from './presentation/interceptors/chaos.interceptor';

@Module({
  imports: [
    // Veritabanı Yapılandırması (Taha'nın Docker ayarlarıyla uyumlu)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db', // Docker'da 'db', yerelde 'localhost'
      port: 5432,
      username: 'resiliengine_user',
      password: process.env.DB_PASSWORD || 'password123',
      database: 'resiliengine_db',
      entities: [User],
      synchronize: true, // Geliştirme aşamasında tabloları otomatik oluşturur
    }),
    // User tablosunu modüle tanıtıyoruz
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    UserService,
    UserRepository,
    ChaosEngineService, // Kaos motorunu servis olarak ekledik
    {
      // BU KISIM ÇOK KRİTİK: Kaos Interceptor'ı tüm uygulamada aktif eder
      provide: APP_INTERCEPTOR,
      useClass: ChaosInterceptor,
    },
  ],
})
export class AppModule {}
