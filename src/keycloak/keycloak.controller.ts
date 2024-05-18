import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { KeycloakService } from './keycloak.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('keycloak')
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) { }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.keycloakService.login(loginDto);
  }

  @Post("signup")
  signUp(@Body() loginDto: SignUpDto) {
    return this.keycloakService.signUp(loginDto);
  }
}
