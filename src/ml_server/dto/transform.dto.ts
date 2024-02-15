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
        type: String,
        description: "url reference image"
    })
    reference_img: string
}
