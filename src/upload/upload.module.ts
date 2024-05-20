import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ImageService } from 'src/image/image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'src/image/entity/image.entity';
import { MlServerService } from 'src/ml_server/ml_server.service';
import { AniganUserEntity } from 'src/keycloak/entities/anigan_user.entity';
import { PlanService } from 'src/plan/plan.service';
import { MobileTrackingEntity } from 'src/plan/entity/mobile_tracking.entity';
import { PlanEntity } from 'src/plan/entity/plan.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity, AniganUserEntity, MobileTrackingEntity, PlanEntity])],
  controllers: [UploadController],
  providers: [ImageService, MlServerService, PlanService, MobileTrackingEntity, AuthService]
})
export class UploadModule { }
