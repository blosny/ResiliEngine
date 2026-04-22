import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Hem senin istediğin CORS hem Taha'nın istediği Port ayarı:
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
