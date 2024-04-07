import { Injectable } from '@nestjs/common';
import axios from 'axios';
import https from 'https';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class KeycloakService {

  async login(loginDto: LoginDto) {
    const url = `${process.env.KEYCLOAK_URL}${process.env.KEYCLOAK_PREFIX}/protocol/openid-connect/token`;

    const { username, password } = loginDto;
    try {
      const response = await axios.post(url, null, {
        params: {
          client_id: 'anigan-be',
          client_secret: 'i2UrEL07qUBU2sEQSTIDQ0gUuOaC9WtF',
          grant_type: 'password',
          username,
          password,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      console.log({ data: response });

      return response;
    } catch (error) {
      // Handle error
      console.error('Error:', error.response);
      throw error;
    }
  }
}
