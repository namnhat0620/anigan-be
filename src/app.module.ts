import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { config } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';
import { ImageEntity } from './image/entity/image.entity';
import { AppController } from './app.controller';
import { MlServerModule } from './ml_server/ml_server.module';

config(); // Loads the environment variables from .env

@Module({
  imports: [
    UploadModule, MlServerModule, ImageModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DBNAME,
      entities: [ImageEntity],
      synchronize: true,
      ssl: true,
      extra: {
        project: process.env.ENDPOINT_ID,
      }
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
