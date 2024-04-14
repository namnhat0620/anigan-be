import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class KeycloakService {
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
