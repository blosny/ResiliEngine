import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // STAGE 5 İÇİN Taha'nın beklediği CORS ayarı
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
