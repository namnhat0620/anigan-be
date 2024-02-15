import { Body, Controller, HttpException, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { storageConfig } from '../utils/config/upload';
import { ApiTags } from '@nestjs/swagger';
import { ImageService } from 'src/image/image.service';
import { ImageType } from 'src/utils/enum/image.enum';
import { UrlResponse } from './response/url.response';
import { MlServerService } from 'src/ml_server/ml_server.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private imageService: ImageService,
    private mlServerService: MlServerService
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

    const path = file.path.split('\\').join('/')
    //Save to db
    await this.imageService.saveImage({
      type: ImageType.REFERENCE_IMAGE,
      url: path
    })

    //Save to ML server
    await this.mlServerService.uploadImage(path, process.env.ML_SERVER_URL)
    return { url: UrlResponse.toString(path) }
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
  async uploadUserImageAndFailValidation(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { reference_image_url: string }
  ) {
    if (req.fileValidationError) throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST)
    if (!file) throw new HttpException('File is required', HttpStatus.BAD_REQUEST)

    const path = file.path.split('\\').join('/')
    await this.imageService.saveImage({
      type: ImageType.USER_IMAGE,
      url: path
    })

    const url = await this.mlServerService.transform({
      user_id: null,
      reference_img: body.reference_image_url,
      source_img: path
    })

    return { url: UrlResponse.toString(url) }
  }
}
