import { Module } from '@nestjs/common';
import { AniganService } from './anigan.service';
import { AniganController } from './anigan.controller';
import { FileDownloadService } from 'src/download/download.service';

@Module({
  controllers: [AniganController],
  providers: [AniganService, FileDownloadService],
})
export class AniganModule { }
