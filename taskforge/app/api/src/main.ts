import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Enabling class-validator pipes

    app.enableCors({ origin: process.env.VITE_API_URL ?? 'http://localhost:5173' });

    await app.listen(process.env.PORT ?? 4500);
}
bootstrap();
