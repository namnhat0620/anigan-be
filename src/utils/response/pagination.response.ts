import { ApiProperty } from "@nestjs/swagger";

export class PaginationResponse {
    @ApiProperty({
        type: Number,
        example: 20
    })
    limit: number

    @ApiProperty({
        type: Number,
        example: 20
    })
    total_record: number

    constructor(data?: any) {
        this.limit = data?.limit;
        this.total_record = data?.total_record;
    }
}