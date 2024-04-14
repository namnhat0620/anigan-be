import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
import * as https from 'https';

@Injectable()
export class KeycloakService {
  async login(loginDto: LoginDto) {
    const url = `${process.env.KEYCLOAK_URL}/${process.env.KEYCLOAK_PREFIX}protocol/openid-connect/token`;
    console.log({ url });

    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const { username, password } = loginDto;
    try {
      const response = await axios.post(url, {
        client_id: 'anigan-be',
        client_secret: 'i2UrEL07qUBU2sEQSTIDQ0gUuOaC9WtF',
        grant_type: 'password',
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        httpsAgent,
      });
      return response.data
    } catch (error) {
      // Handle error
      console.error('Error:', error.response);
      throw error;
    }
  }
}
