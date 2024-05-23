import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakService } from './keycloak.service';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AniganUserEntity } from './entities/anigan_user.entity';
import { PlanEntity } from 'src/plan/entity/plan.entity';
import { config } from 'dotenv';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
config(); // Loads the environment variables from .env

describe('KeycloakService', () => {
    let service: KeycloakService;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forFeature([AniganUserEntity]),
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DATABASE_HOST,
                    port: parseInt(process.env.DATABASE_PORT),
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_DBNAME,
                    entities: [AniganUserEntity, PlanEntity],
                    // synchronize: true,
                    ssl: true,
                    extra: {
                        project: process.env.ENDPOINT_ID,
                    }
                }),
            ],
            providers: [KeycloakService, AuthService],
        }).compile();

        service = module.get<KeycloakService>(KeycloakService);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(authService).toBeDefined();
    });

    describe('login', () => {

        it('should throw BadRequestException on error', async () => {
            const loginDto = { username: 'testuser', password: 'testpassword' };
            const errorResponse = {
                response: {
                    data: {
                        error_description: 'Invalid credentials',
                    },
                },
            };

            mockedAxios.post.mockRejectedValueOnce(errorResponse);

            await expect(service.login(loginDto)).rejects.toThrow(
                new BadRequestException('Invalid credentials'),
            );

            expect(mockedAxios.post).toHaveBeenCalledWith(
                `${process.env.KEYCLOAK_URL}/${process.env.KEYCLOAK_PREFIX}protocol/openid-connect/token`,
                {
                    client_id: process.env.KEYCLOAK_CLIENT_ID,
                    client_secret: process.env.KEYCLOAK_CLIENT_SECRET_KEY,
                    grant_type: 'password',
                    username: loginDto.username,
                    password: loginDto.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );
        });

        it('should throw BadRequestException with default message on unknown error', async () => {
            const loginDto = { username: 'testuser', password: 'testpassword' };
            const errorResponse = {};

            mockedAxios.post.mockRejectedValueOnce(errorResponse);

            await expect(service.login(loginDto)).rejects.toThrow(
                new BadRequestException('Something wrong when login'),
            );

            expect(mockedAxios.post).toHaveBeenCalledWith(
                `${process.env.KEYCLOAK_URL}/${process.env.KEYCLOAK_PREFIX}protocol/openid-connect/token`,
                {
                    client_id: process.env.KEYCLOAK_CLIENT_ID,
                    client_secret: process.env.KEYCLOAK_CLIENT_SECRET_KEY,
                    grant_type: 'password',
                    username: loginDto.username,
                    password: loginDto.password,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );
        });
    });
});
