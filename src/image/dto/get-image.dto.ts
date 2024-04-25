import { PaginationDto } from "src/utils/dto/pagination.dto";
import { ApiProperty } from "@nestjs/swagger"
import { ImageType } from "src/utils/enum/image.enum";

export class GetImageQueryDto extends PaginationDto {
    @ApiProperty({
        type: Number,
        default: 1,
        required: false
    })
    type: ImageType
}