import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Enabling class-validator pipes

    // Enable CORS so the React frontend (running on port 5173) can call this API
    app.enableCors({ origin: 'http://localhost:5173' });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
