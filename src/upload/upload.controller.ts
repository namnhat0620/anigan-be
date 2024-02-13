import { Controller, HttpException, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { storageConfig } from '../utils/config/upload';
import { ApiTags } from '@nestjs/swagger';
import { ImageService } from 'src/image/image.service';
import { ImageType } from 'src/utils/enum/image.enum';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private imageService: ImageService
  ) { }

  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig('reference'),
    fileFilter: (req, file, cb) => {
      const ext = extname(file.originalname);

      const allowedExtArr = ['.jpg', '.png', '.jpeg', '.gif'];
      if (!allowedExtArr.includes(ext)) {
        req.fileValidationError = `Không hỗ trợ loại file này. Những file được hỗ trợ: ${allowedExtArr.toString()}`,
          cb(null, false)
      }
      else {
        cb(null, true)
      }
    }
  }))
  @Post('reference')
  async uploadReferenceImageAndFailValidation(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST)
    if (!file) throw new HttpException('File is required', HttpStatus.BAD_REQUEST)
    await this.imageService.saveImage({
      type: ImageType.REFERENCE_IMAGE,
      url: file.path
    })
    return { path: file.path }
  }

  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig('user'),
    fileFilter: (req, file, cb) => {
      const ext = extname(file.originalname);

      const allowedExtArr = ['.jpg', '.png', '.jpeg', '.gif'];
      if (!allowedExtArr.includes(ext)) {
        req.fileValidationError = `Không hỗ trợ loại file này. Những file được hỗ trợ: ${allowedExtArr.toString()}`,
          cb(null, false)
      }
      else {
        cb(null, true)
      }
    }
  }))
  @Post('user')
  uploadUserImageAndFailValidation(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (req.fileValidationError) throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST)
    if (!file) throw new HttpException('File is required', HttpStatus.BAD_REQUEST)
    return { path: file.path }
  }
}
