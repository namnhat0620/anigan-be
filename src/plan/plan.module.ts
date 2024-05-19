import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { AniganUserEntity } from 'src/keycloak/entities/anigan_user.entity';
import { MobileTrackingEntity } from './entity/mobile_tracking.entity';
import { PlanEntity } from './entity/plan.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity, MobileTrackingEntity, AniganUserEntity])],
  controllers: [PlanController],
  providers: [PlanService, AuthService],
})
export class PlanModule { }
