import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  await app.listen(8000);
  console.log('REST API is listening on port 8000');
}
bootstrap();
