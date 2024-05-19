import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { KeycloakController } from './keycloak.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AniganUserEntity } from './entities/anigan_user.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([AniganUserEntity])],
  controllers: [KeycloakController],
  providers: [KeycloakService, AuthService],
})
export class KeycloakModule { }
