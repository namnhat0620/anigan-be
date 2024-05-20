export class CreateUserDto {
    firstName: string
    lastName: string
    email: string
    username: string
    enabled: boolean
    credentials: { type: string; value: string; temporary: boolean; }[]

    constructor(data: any) {
        this.firstName = data?.firstName;
        this.lastName = data?.lastName;
        this.email = data?.email;
        this.username = data?.username;
        this.enabled = true;
        this.credentials = [{
            type: "password",
            value: data.password,
            temporary: false
        }]
    }
}