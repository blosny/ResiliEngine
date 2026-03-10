import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 1. Entity (Tablo) Import
import { User } from './domain/entities/user.entity';

// 2. Repository Import (Altyapı katmanı)
import { UserRepository } from './infrastructure/repositories/user.repository';

// 3. Service Import (İş mantığı katmanı)
import { UserService } from './application/services/user.service';

// 4. Controller Import (Sunum katmanı)
import { UserController } from './presentation/controllers/user.controller';

@Module({
  imports: [
    // Veritabanı Bağlantısı (Taha'nın Docker ayarlarıyla uyumlu)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Docker konteynırı dışında çalışırken localhost, içinde 'db' olur
      port: 5432,
      username: 'resiliengine_user',
      password: 'password123',
      database: 'resiliengine_db',
      entities: [User],
      synchronize: true, // Geliştirme aşamasında tabloları otomatik oluşturur (PDF Madde 2 - Migration uyarısına dikkat, ileride kapatacağız)
    }),
    // User Entity'sini bu modüle kaydediyoruz
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    UserService,
    UserRepository, // Repository'yi mutlaka buraya eklemelisin!
  ],
})
export class AppModule {}
