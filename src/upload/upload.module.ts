import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ImageService } from 'src/image/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'src/image/entity/image.entity';
import { MlServerService } from 'src/ml_server/ml_server.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [UploadController],
  providers: [ImageService, MlServerService]
})
export class UploadModule { }
