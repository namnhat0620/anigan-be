import { ApiProperty } from "@nestjs/swagger"

export class PaginationDto {
    @ApiProperty({
        type: Number,
        default: 1,
        required: false
    })
    page: number

    @ApiProperty({
        type: Number,
        default: 20,
        required: false
    })
    limit: number
}