import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolveUploadsDir } from './utils/uploads-path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const uploadsPath = resolveUploadsDir();
  app.useStaticAssets(uploadsPath, { prefix: '/uploads' });
  console.log(`[uploads] serving from: ${uploadsPath}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
