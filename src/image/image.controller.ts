import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerListRefImageResponse } from './response/list-reference-image.response';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { BaseResponse } from 'src/utils/response/base.response';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Get('reference')
  @ApiOperation({ summary: 'Get list reference images', })
  @ApiResponse({
    type: SwaggerListRefImageResponse,
    status: HttpStatus.OK
  })
  async getListRefImage(
    @Query() paginationDto: PaginationDto,
    @Res() res: any
  ) {
    const data = await this.imageService.getListRefImage(paginationDto);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }))
  }
}
