import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { ImageEntity } from './entity/image.entity';
import { Repository } from 'typeorm';
import { SaveImageDto } from './dto/save-image.dto';
import { ImageType } from 'src/utils/enum/image.enum';
import { RefImageResponse } from './response/list-reference-image.response';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
    ) { }

    async getListRefImage(paginationDto: PaginationDto) {

        const page = +paginationDto.page || 1;
        const limit = +paginationDto.limit || 20;
        const skip = (page - 1) * limit;

        const [listRefImg, total_record] = await this.imageRepository.findAndCount({
            where: { type: ImageType.REFERENCE_IMAGE },
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
        await this.imageRepository.save(saveImageDto)
    }
}
