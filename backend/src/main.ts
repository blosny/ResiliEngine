import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. GÜVENLİK (Helmet): HTTP başlıklarını güvenli hale getirir (XSS, Clickjacking vb. koruması)
  app.use(helmet());

  // 2. CORS (Cross-Origin Resource Sharing):
  // Dashboard'un backend ile güvenli konuşmasını sağlar.
  app.enableCors({
    origin: [
      'http://localhost:5173', // Yerel Frontend (Vite default)
      'https://resiliengine-dashboard.onrender.com', // Taha'nın Dashboard adresi
      'https://resiliengine-frontend.onrender.com',  // Asıl Frontend adresi
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 3. PORT AYARI: Render.com dinamik port atar, yerelde 3000 kullanılır.
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Backend ready on port: ${port}`);
  console.log(`🛡️ Security (Helmet) and CORS are active.`);
}
bootstrap();
