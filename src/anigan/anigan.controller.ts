import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AniganService } from './anigan.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/response/base.response';
import { TransformDto } from './dto/transform.dto';

@ApiTags('Anigan')
@Controller('anigan')
export class AniganController {
  constructor(private readonly aniganService: AniganService) { }

  @Post('transform')
  @ApiOperation({ summary: "Transform user's image into Ani-style image" })
  @ApiResponse({
    type: BaseResponse,
    status: HttpStatus.OK
  })
  async transform(
    @Body() transformDto: TransformDto,
    @Res() res: any) {
    const data = await this.aniganService.transform(transformDto);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }))
  }
}
