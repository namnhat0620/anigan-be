import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/utils/response/base.response";
import { PaginationResponse } from "src/utils/response/pagination.response";

export class RefImageResponse {
    @ApiProperty({
        type: Number,
        example: 1,
        description: 'Id image'
    })
    image_id: number;

    @ApiProperty({
        type: String,
        example: 'content/image.png',
        description: 'url'
    })
    url: string;

    @ApiProperty({
        type: Number,
        example: 0,
        description: `
        0: REFERENCE_IMAGE,
        1: USER_IMAGE,
        2: ANIGAN_IMAGE`
    })
    type: number;

    constructor(data?: RefImageResponse) {
        this.image_id = data?.image_id;
        this.url = data?.url;
        this.type = data?.type
    }

    static mapToList(data?: RefImageResponse[]) {
        return data.map(item => new RefImageResponse(item))
    }
}

export class ListRefImageResponse extends PaginationResponse {
    @ApiProperty({
        type: RefImageResponse,
        isArray: true
    })
    list: RefImageResponse[]
}

export class SwaggerListRefImageResponse extends BaseResponse {
    @ApiProperty({
        type: ListRefImageResponse
    })
    data: ListRefImageResponse
}