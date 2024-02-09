import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
    @ApiProperty({
        type: Number,
        default: HttpStatus.OK
    })
    statusCode: number

    @ApiProperty({
        type: String,
        default: 'Success'
    })
    message: string

    data: any;

    constructor(data?: any) {
        this.statusCode = data?.statusCode || data?.status || HttpStatus.OK;
        this.message = data?.message || data?.response || 'Success';
        this.data = data?.data;
    }
}