import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/response/base.response';
import { GetImageQueryDto } from './dto/get-image.dto';
import { ImageService } from './image.service';
import { SwaggerListRefImageResponse } from './response/list-reference-image.response';
import { TransformDto } from './dto/transform.dto';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Get('')
  @ApiOperation({ summary: 'Get list reference images', })
  @ApiResponse({
    type: SwaggerListRefImageResponse,
    status: HttpStatus.OK
  })
  async getListRefImage(
    @Query() getImageQueryDto: GetImageQueryDto,
    @Res() res: any
  ) {
    const data = await this.imageService.getListImage(getImageQueryDto);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }))
  }

  @Post('transform')
  @ApiOperation({ summary: 'Transform images', })
  async transformImage(
    @Body() transformImageDto: TransformDto,
    @Res() res: any
  ) {
    const data = await this.imageService.transform(transformImageDto);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }))
  }
}
