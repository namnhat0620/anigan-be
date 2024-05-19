import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { config } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from './image/image.module';
import { ImageEntity } from './image/entity/image.entity';
import { AppController } from './app.controller';
import { MlServerModule } from './ml_server/ml_server.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { PlanModule } from './plan/plan.module';
import { PlanEntity } from './plan/entity/plan.entity';
import { AniganUserEntity } from './keycloak/entities/anigan_user.entity';
import { MobileTrackingEntity } from './plan/entity/mobile_tracking.entity';

config(); // Loads the environment variables from .env

@Module({
  imports: [
    UploadModule, MlServerModule, ImageModule, KeycloakModule, PlanModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DBNAME,
      entities: [ImageEntity, PlanEntity, AniganUserEntity, MobileTrackingEntity],
      // synchronize: true,
      ssl: true,
      extra: {
        project: process.env.ENDPOINT_ID,
      }
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
