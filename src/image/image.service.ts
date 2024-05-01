import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetImageQueryDto } from './dto/get-image.dto';
import { SaveImageDto } from './dto/save-image.dto';
import { ImageEntity } from './entity/image.entity';
import { RefImageResponse } from './response/list-reference-image.response';
import { TransformDto } from './dto/transform.dto';
import { MlServerService } from 'src/ml_server/ml_server.service';
import { ImageType } from 'src/utils/enum/image.enum';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        private readonly mlService: MlServerService
    ) { }

    async getListImage(getImageQueryDto: GetImageQueryDto) {

        const page = +getImageQueryDto.page || 1;
        const limit = +getImageQueryDto.limit || 20;
        const skip = (page - 1) * limit;

        const [listRefImg, total_record] = await this.imageRepository.findAndCount({
            where: { type: getImageQueryDto.type },
            take: limit,
            skip,
            order: { image_id: 'DESC' }
        })

        const list = RefImageResponse.mapToList(listRefImg)
        return {
            limit,
            total_record,
            list
        }
    }

    async saveImage(saveImageDto: SaveImageDto) {
        return await this.imageRepository.save(saveImageDto)
    }

    async transform(transformDto: TransformDto): Promise<RefImageResponse> {
        const url = await this.mlService.transform(transformDto)
        const savedImage = await this.saveImage({
            url,
            type: ImageType.ANIGAN_IMAGE
        })
        return new RefImageResponse(savedImage)
    }
}
