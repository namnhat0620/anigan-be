import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ImageService } from 'src/image/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'src/image/entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [UploadController],
  providers: [ImageService]
})
export class UploadModule { }
