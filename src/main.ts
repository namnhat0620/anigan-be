import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Chat-app')
    .setDescription('The chat-app API description')
    .setVersion('1.7')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use('/public', express.static('public'));

  const port = parseInt(process.env.PORT)
  await app.listen(port, '0.0.0.0');
  console.log(`App running at port: ${port}`);

}
bootstrap();
