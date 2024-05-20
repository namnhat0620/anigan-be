import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entity/image.entity';
import { MlServerService } from 'src/ml_server/ml_server.service';
import { PlanService } from 'src/plan/plan.service';
import { AniganUserEntity } from 'src/keycloak/entities/anigan_user.entity';
import { MobileTrackingEntity } from 'src/plan/entity/mobile_tracking.entity';
import { PlanEntity } from 'src/plan/entity/plan.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity, AniganUserEntity, MobileTrackingEntity, PlanEntity])],
  controllers: [ImageController],
  providers: [ImageService, MlServerService, PlanService, AuthService],
})
export class ImageModule { }
