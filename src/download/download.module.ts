import { Module } from '@nestjs/common';
import { FileDownloadService } from './download.service';

@Module({
  providers: [FileDownloadService]
})
export class DownloadModule { }
