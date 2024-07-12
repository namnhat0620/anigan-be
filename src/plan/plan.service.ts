import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs'
import { AuthService } from 'src/auth/auth.service';
import { AniganUserEntity } from 'src/keycloak/entities/anigan_user.entity';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { RegisterPlanDto } from './dto/register-plan.dto';
import { MobileTrackingEntity } from './entity/mobile_tracking.entity';
import { PlanEntity } from './entity/plan.entity';
import { GetAllPlanResponse } from './response/get-all-plan.response';
import { GetPlanResponse } from './response/get-plan.response';

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
            const mobileTracking = await this.getTrackingMobile(authHeader)
            return new GetPlanResponse({
                remain_generation: maxTimeGenerationConfig - mobileTracking.number_of_generated,
                expired_day: "Illuminate the pro flag"
            })
        }
        else {
            //TODO: get plan
            const user = await this.getAniganUser(authHeader)

            return new GetPlanResponse({
                remain_generation: +(user?.plan?.number_of_generation ?? process.env.MAX_TIME_GENERATION) - user?.number_of_generated,
                expired_day: user?.expired_at ? `Expired day: ${dayjs(user.expired_at).format('YYYY-MM-DD')}` : "Illuminate the pro flag"
            })
        }
    }


    async registerPlan(authHeader: string, registerPlanDto: RegisterPlanDto) {
        console.debug('Enter registerPlan with', { authHeader, registerPlanDto });

        // Get user id
        const user_id = this.authService.extractSubFromToken(authHeader);
        const { plan_id } = registerPlanDto;
        const plan = await this.planRepository.findOneBy({ plan_id })
        console.log({ plan })
        await this.aniganUserRepository.update(
            { keycloak_user_id: user_id },
            { plan: plan, expired_at: dayjs(new Date()).add(plan?.period, 'month').toDate() }
        )

        return { number_of_generation: plan.number_of_generation }
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

    async getTrackingMobile(device_id: string): Promise<MobileTrackingEntity> {
        //TODO: Check user not login
        const mobileTracking = await this.mobileTrackingRepository.findOneBy({
            mobile_id: device_id
        })
        if (mobileTracking) return mobileTracking
        else {
            return await this.mobileTrackingRepository.save({
                mobile_id: device_id,
                number_of_generated: 0
            })
        }
    }

    async getAniganUser(token: string): Promise<AniganUserEntity> {
        const userId = this.authService.extractSubFromToken(token);
        const user = await this.aniganUserRepository.findOne({
            where: { keycloak_user_id: userId },
            relations: { plan: true }
        })
        if (user == null) {
            throw new BadRequestException("Cannot find user's information")
        }
        return user
    }
}
