import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { KeycloakController } from './keycloak.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AniganUserEntity } from './entities/anigan_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AniganUserEntity])],
  controllers: [KeycloakController],
  providers: [KeycloakService],
})
export class KeycloakModule { }
