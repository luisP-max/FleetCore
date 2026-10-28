import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // OpenAPI Swagger Configuration (Page 10 Requirement)
  const config = new DocumentBuilder()
    .setTitle('FleetCore - Fleet Maintenance API')
    .setDescription('Official API documentation for managing vehicle life cycles, mechanics allocation, and workshop operations.')
    .setVersion('1.0')
    .addBearerAuth() // Allows testing endpoints with JWT Tokens inside Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Exposed at /docs

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(` FleetCore running on: http://localhost:${port}/api/v1`);
  console.log(` Swagger documentation available at: http://localhost:${port}/docs`);
}
bootstrap();
