import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { DownloadModule } from './download/download.module';
import { AniganModule } from './anigan/anigan.module';
import { config } from 'dotenv';

config(); // Loads the environment variables from .env

@Module({
  imports: [UploadModule, DownloadModule, AniganModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
