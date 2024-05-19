import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MlServerService } from 'src/ml_server/ml_server.service';
import { ImageType } from 'src/utils/enum/image.enum';
import { AuthService } from 'src/auth/auth.service';
import { MobileTrackingEntity } from './entity/mobile_tracking.entity';
import { GetPlanResponse } from './response/get-plan.response';
import { RegisterPlanDto } from './dto/register-plan.dto';
import { PlanEntity } from './entity/plan.entity';
import { AniganUserEntity } from 'src/keycloak/entities/anigan_user.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { GetAllPlanResponse } from './response/get-all-plan.response';

@Injectable()
export class PlanService {
    constructor(
        @InjectRepository(MobileTrackingEntity)
        private readonly mobileTrackingRepository: Repository<MobileTrackingEntity>,
        @InjectRepository(PlanEntity)
        private readonly planRepository: Repository<PlanEntity>,
        @InjectRepository(AniganUserEntity)
        private readonly aniganUserRepository: Repository<AniganUserEntity>,
        // private readonly mlService: MlServerService
        private readonly authService: AuthService
    ) { }

    async getPlan(authHeader: string, device_id: string) {
        console.debug("Enter getPlan with", { authHeader, device_id });

        const maxTimeGenerationConfig = +process.env.MAX_TIME_GENERATION
        if (!authHeader) {
            //TODO: Check user not login
            const mobileTracking = await this.mobileTrackingRepository.findOneBy({
                mobile_id: device_id
            })
            if (mobileTracking == null) {
                await this.mobileTrackingRepository.save({
                    mobile_id: device_id,
                    number_of_generated: 0
                })
                return new GetPlanResponse({
                    remain_generation: maxTimeGenerationConfig,
                    expired_day: "Illuminate the pro flag"
                })
            }
            else {
                return new GetPlanResponse({
                    remain_generation: maxTimeGenerationConfig - mobileTracking.number_of_generated,
                    expired_day: "Illuminate the pro flag"
                })
            }
        }
        else {
            //TODO: get plan
        }
    }


    async registerPlan(authHeader: string, registerPlanDto: RegisterPlanDto) {
        console.debug('Enter registerPlan with', { authHeader, registerPlanDto });

        // Get user id
        const user_id = this.authService.extractSubFromToken(authHeader);
        const { plan_id } = registerPlanDto;
        await this.aniganUserRepository.update(
            { keycloak_user_id: user_id },
            { plan: { plan_id } }
        )
    }

    async createPlan(authHeader: string, createPlanDto: CreatePlanDto) {
        console.debug('Enter registerPlan with', { authHeader, createPlanDto });

        const user_id = this.authService.extractSubFromToken(authHeader);
        await this.planRepository.save({
            amount: createPlanDto.amount,
            name: createPlanDto.name,
            number_of_generation: createPlanDto.number_of_generation,
            period: createPlanDto.period,
            created_by: user_id,
            updated_by: user_id
        })
    }

    async getListPlan(paginationDto: PaginationDto) {
        console.debug('Enter getListPlan with', { paginationDto })

        const page = +paginationDto.page || 1;
        const limit = +paginationDto.limit || 20;
        const skip = (page - 1) * limit;

        const [listPlan, total_record] = await this.planRepository.findAndCount({
            take: limit,
            skip,
            order: { amount: 'ASC' }
        })

        const list = GetAllPlanResponse.mapToList(listPlan)
        return {
            limit,
            total_record,
            list
        }
    }

    // async saveImage(saveImageDto: SaveImageDto) {
    //     return await this.imageRepository.save(saveImageDto)
    // }

    // async transform(transformDto: TransformDto): Promise<RefImageResponse> {
    //     const url = await this.mlService.transform(transformDto)
    //     const savedImage = await this.saveImage({
    //         url,
    //         type: ImageType.ANIGAN_IMAGE
    //     })
    //     return new RefImageResponse(savedImage)
    // }
}
