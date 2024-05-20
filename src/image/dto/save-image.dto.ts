import { ImageType } from "src/utils/enum/image.enum"

export class SaveImageDto {
    url: string
    type: ImageType
    created_by: string;
    updated_by: string;
}