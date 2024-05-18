import { LoginDto } from "./login.dto"

export class SignUpDto extends LoginDto {
    firstName: string
    lastName: string
    email: string
}
