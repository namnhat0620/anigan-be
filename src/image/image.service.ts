import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { ImageEntity } from './entity/image.entity';
import { Repository } from 'typeorm';
import { SaveImageDto } from './dto/save-image.dto';

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

        await this.imageRepository.find({
            take: limit,
            skip
        })
    }

    async saveImage(saveImageDto: SaveImageDto) {
        await this.imageRepository.save(saveImageDto)
    }
}
