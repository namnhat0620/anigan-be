import { Controller, HttpException, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { storageConfig } from '../utils/config/upload';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor() { }

  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig('avatar'),
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
  @Post('image')
  uploadImageAndFailValidation(
    @Req() req: any,
    @UploadedFile(
      // new ParseFilePipeBuilder()
      //   .addFileTypeValidator({
      //     fileType: 'png',
      //   })
      //   .build(),
    )
    file: Express.Multer.File,
  ) {
    if (req.fileValidationError) throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST)
    if (!file) throw new HttpException('File is required', HttpStatus.BAD_REQUEST)
    return { path: file.path }
  }

  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig('avatar'),
    fileFilter: (req, file, cb) => {
      const ext = extname(file.originalname);

      const allowedExtArr = ['.zip', '.rar', '.txt', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.csv'];
      if (!allowedExtArr.includes(ext)) {
        req.fileValidationError = `Không hỗ trợ loại file này. Những file được hỗ trợ: ${allowedExtArr.toString()}`,
          cb(null, false)
      }
      else {
        cb(null, true)
      }
    }
  }))
  @Post('file')
  uploadFileAndFailValidation(
    @Req() req: any,
    @UploadedFile(
      // new ParseFilePipeBuilder()
      //   .addFileTypeValidator({
      //     fileType: 'png',
      //   })
      //   .build(),
    )
    file: Express.Multer.File,
  ) {
    if (req.fileValidationError) throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST)
    if (!file) throw new HttpException('File is required', HttpStatus.BAD_REQUEST)
    return { path: file.path }
  }
}
