import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { CreateUserDto } from './dto/create_user.dto';
import { User } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AniganUserEntity } from './entities/anigan_user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class KeycloakService {

  constructor(
    @InjectRepository(AniganUserEntity)
    private readonly userRepository: Repository<AniganUserEntity>,

    private readonly authService: AuthService
  ) { }

  async signUp(userData: SignUpDto): Promise<any> {
    console.log("Enter signUp with", { userData });

    const accessToken = await this.login({
      username: "admin@gmail.com",
      password: "admin"
    }).then(data => data.access_token)

    const username = userData.username
    const signUpUrl = `${process.env.KEYCLOAK_URL}/admin/${process.env.KEYCLOAK_PREFIX}users`;
    const getInfoUrl = `${process.env.KEYCLOAK_URL}/admin/${process.env.KEYCLOAK_PREFIX}users?username=${username}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    try {
      const signUpResponse = await axios.post(signUpUrl, new CreateUserDto(userData), { headers });
      // Save user id
      const getInfoResponse = await axios.get(getInfoUrl, { headers })
      const createdUser = getInfoResponse.data.find(user => user?.username === userData?.username);
      await this.userRepository.save({
        keycloak_user_id: createdUser.id
      });
      return signUpResponse.data
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.response?.data?.errorMessage ?? "Something wrong when sign up");
    }
  }

  async login(loginDto: LoginDto) {
    const url = `${process.env.KEYCLOAK_URL}/${process.env.KEYCLOAK_PREFIX}protocol/openid-connect/token`;

    const { username, password } = loginDto;
    try {
      const response = await axios.post(url, {
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET_KEY,
        grant_type: 'password',
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data
    } catch (error) {
      // Handle error
      console.error('Error:', error.response);
      throw new BadRequestException(error?.response?.data?.error_description ?? "Something wrong when login");
    }
  }

  async logout(authHeader: string) {
    console.log("Enter logout with", { authHeader });

    const refreshToken = this.authService.extractToken(authHeader);
    const url = `${process.env.KEYCLOAK_URL}/${process.env.KEYCLOAK_PREFIX}protocol/openid-connect/logout`;
    try {
      const response = await axios.post(url, {
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET_KEY,
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data
    } catch (error) {
      // Handle error
      console.error('Error:', error.response);
      throw new BadRequestException(error?.response?.data?.error ?? "Something wrong when logout");
    }
  }

  async refreshToken(token: string) {
    const url = `${process.env.KEYCLOAK_URL}/${process.env.KEYCLOAK_PREFIX}protocol/openid-connect/token`;
    const refreshToken = this.authService.extractToken(token)
    try {
      const response = await axios.post(url, {
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET_KEY,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error:', error.response);
      throw new BadRequestException(error?.response?.data?.error_description ?? "Something wrong when refresh token");
    }
  }
}
