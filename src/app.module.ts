import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { DownloadModule } from './download/download.module';
import { AniganModule } from './anigan/anigan.module';
import { config } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';
import { ImageEntity } from './image/entity/image.entity';

config(); // Loads the environment variables from .env

@Module({
  imports: [
    UploadModule, DownloadModule, AniganModule,
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
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
