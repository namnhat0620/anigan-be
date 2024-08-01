import { ApiProperty } from "@nestjs/swagger";

export class TransformDto {
    @ApiProperty({
        type: Number,
        description: "User's id",
        example: 1,
        required: false
    })
    user_id: number

    @ApiProperty({
        type: String,
        description: "url user's image"
    })
    source_img: string

    @ApiProperty({
        type: Number,
        description: "url reference image"
    })
    reference_img: number

    @ApiProperty({
        type: String,
        description: "id of model ml"
    })
    model_id: string

    @ApiProperty({
        type: String,
        description: "Device id",
        required: true
    })
    mobile_id: string

    @ApiProperty({
        type: String,
        description: "Resolution option",
        required: true
    })
    resolution_option: string
}
