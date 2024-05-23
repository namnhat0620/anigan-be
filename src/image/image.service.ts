import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Or, Repository } from 'typeorm';
import { GetImageQueryDto } from './dto/get-image.dto';
import { SaveImageDto } from './dto/save-image.dto';
import { ImageEntity } from './entity/image.entity';
import { RefImageResponse } from './response/list-reference-image.response';
import { TransformDto } from './dto/transform.dto';
import { MlServerService } from 'src/ml_server/ml_server.service';
import { ImageType } from 'src/utils/enum/image.enum';
import { AniganUserEntity } from 'src/keycloak/entities/anigan_user.entity';
import { PlanService } from 'src/plan/plan.service';
import { MobileTrackingEntity } from 'src/plan/entity/mobile_tracking.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        @InjectRepository(AniganUserEntity)
        private readonly userRepository: Repository<AniganUserEntity>,
        @InjectRepository(MobileTrackingEntity)
        private readonly mobileTrackingRepository: Repository<MobileTrackingEntity>,
        private readonly planService: PlanService,
        private readonly mlService: MlServerService,
        private readonly authService: AuthService
    ) { }

    async getListImage(headerToken: string, getImageQueryDto: GetImageQueryDto) {
        const userId = !headerToken ? "" : this.authService.extractSubFromToken(headerToken)
        const page = +getImageQueryDto.page || 1;
        const limit = +getImageQueryDto.limit || 20;
        const skip = (page - 1) * limit;

        const [listRefImg, total_record] = await this.imageRepository.findAndCount({
            where: [{
                type: getImageQueryDto.type,
                created_by: userId
            },
            {
                type: getImageQueryDto.type,
                created_by: getImageQueryDto.device_id
            }],
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

    async transform(token: string, transformDto: TransformDto): Promise<RefImageResponse> {
        console.log("Enter transform with", { token, transformDto });
        let savedImage: ImageEntity;
        if (!token) {
            const mobileTracking = await this.planService.getTrackingMobile(transformDto.mobile_id);
            if (mobileTracking.number_of_generated >= +process.env.MAX_TIME_GENERATION) {
                throw new BadRequestException("Reach limit of generation!")
            }
            else {
                const url = await this.mlService.transform(transformDto)
                savedImage = await this.saveImage({
                    url,
                    type: ImageType.ANIGAN_IMAGE,
                    created_by: mobileTracking.mobile_id,
                    updated_by: mobileTracking.mobile_id
                })
                await this.mobileTrackingRepository.update({
                    mobile_id: mobileTracking.mobile_id
                }, {
                    number_of_generated: (mobileTracking.number_of_generated ?? 0) + 1
                })
            }
        }
        else {
            const user = await this.planService.getAniganUser(token)
            if (+(user?.plan?.number_of_generation ?? process.env.MAX_TIME_GENERATION) <= user?.number_of_generated) {
                throw new BadRequestException("Reach limit of generation!")
            }
            else {
                const url = await this.mlService.transform(transformDto)
                savedImage = await this.saveImage({
                    url,
                    type: ImageType.ANIGAN_IMAGE,
                    created_by: user.keycloak_user_id,
                    updated_by: user.keycloak_user_id
                })
                await this.userRepository.update({
                    user_id: user?.user_id
                }, {
                    number_of_generated: (user?.number_of_generated ?? 0) + 1
                })
            }
        }
        return new RefImageResponse(savedImage)
    }
}
