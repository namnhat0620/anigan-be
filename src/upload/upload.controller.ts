import { Body, Controller, Headers, HttpException, HttpStatus, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { ImageService } from 'src/image/image.service';
import { MlServerService } from 'src/ml_server/ml_server.service';
import { ImageType } from 'src/utils/enum/image.enum';
import { storageConfig } from '../utils/config/upload';
import { UrlResponse } from './response/url.response';
import { ImageEntity } from 'src/image/entity/image.entity';
import { RefImageResponse } from 'src/image/response/list-reference-image.response';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(
    private imageService: ImageService,
    private mlServerService: MlServerService,
    private authService: AuthService
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
    @UploadedFile() file: Express.Multer.File
  ) {
    if (req.fileValidationError) throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST)
    if (!file) throw new HttpException('File is required', HttpStatus.BAD_REQUEST)

    const path = file.path.split('\\').join('/')
    //Save to db
    await this.imageService.saveImage({
      type: ImageType.REFERENCE_IMAGE,
      url: path,
      created_by: 'admin',
      updated_by: 'admin'
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
    @Headers('Authorization') token: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      mobile_id: string,
      reference_image_url: string,
      model_id: string
    }
  ) {
    console.log("Enter uploadUserImageAndFailValidation with: ", {
      token, body
    });

    if (req.fileValidationError) throw new HttpException(req.fileValidationError, HttpStatus.BAD_REQUEST)
    if (!file) throw new HttpException('File is required', HttpStatus.BAD_REQUEST)

    const path = file.path.split('\\').join('/')
    const createdBy = this.authService.isTechnicalUser(token) ? body?.mobile_id : this.authService.extractSubFromToken(token);
    const savedImage = await this.imageService.saveImage({
      type: ImageType.USER_IMAGE,
      url: path,
      created_by: createdBy,
      updated_by: createdBy
    })
    await this.mlServerService.uploadImage(path, process.env.ML_SERVER_URL)
    console.log("Exit uploadUserImageAndFailValidation with: ", { image: new RefImageResponse(savedImage) });

    return new RefImageResponse(savedImage)
  }
}
