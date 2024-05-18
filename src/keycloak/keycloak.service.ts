import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './dto/user.dto';

@Injectable()
export class KeycloakService {
  async signUp(userData: SignUpDto): Promise<any> {
    const accessToken = await this.login({
      username: "admin@gmail.com",
      password: "admin"
    }).then(data => data.access_token)

    const url = `${process.env.KEYCLOAK_URL}/admin/${process.env.KEYCLOAK_PREFIX}users`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    try {
      const response = await axios.post(url, new User(userData), { headers });
      return response.data;
    } catch (error) {
      throw new Error(error);
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
      throw error;
    }
  }
}
