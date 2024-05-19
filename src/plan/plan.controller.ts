import { Body, Controller, Get, Headers, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/response/base.response';
import { PlanService } from './plan.service';
import { RegisterPlanDto } from './dto/register-plan.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@ApiTags('Plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) { }

  @Get('')
  @ApiOperation({ summary: 'Get list reference images', })
  @ApiResponse({
    // type: SwaggerListRefImageResponse,
    status: HttpStatus.OK
  })
  async getListPlan(
    @Headers('authorization') authHeader: string,
    @Query() paginationDto: PaginationDto,
    @Res() res: any
  ) {
    const data = await this.planService.getListPlan(paginationDto);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }))
  }

  @Get('my-plan')
  @ApiOperation({ summary: 'Get list reference images', })
  @ApiResponse({
    // type: SwaggerListRefImageResponse,
    status: HttpStatus.OK
  })
  async getListRefImage(
    @Headers('authorization') authHeader: string,
    @Query('device_id') device_id: string,
    @Res() res: any
  ) {
    const data = await this.planService.getPlan(authHeader, device_id);
    console.log({ data });

    return res.status(HttpStatus.OK).send(new BaseResponse({ data }))
  }

  @Post()
  @ApiOperation({ summary: 'Get list reference images', })
  @ApiResponse({
    // type: SwaggerListRefImageResponse,
    status: HttpStatus.OK
  })
  async createPlan(
    @Headers('authorization') authHeader: string,
    @Body() createPlanDto: CreatePlanDto,
    @Res() res: any
  ) {
    const data = await this.planService.createPlan(authHeader, createPlanDto);
    return res.status(HttpStatus.CREATED).send(new BaseResponse({ data }))
  }

  @Post('register')
  @ApiOperation({ summary: 'Get list reference images', })
  @ApiResponse({
    // type: SwaggerListRefImageResponse,
    status: HttpStatus.OK
  })
  async registerPlan(
    @Headers('authorization') authHeader: string,
    @Body() createPlanDto: CreatePlanDto,
    @Res() res: any
  ) {
    const data = await this.planService.createPlan(authHeader, createPlanDto);
    return res.status(HttpStatus.OK).send(new BaseResponse({ data }))
  }
}
