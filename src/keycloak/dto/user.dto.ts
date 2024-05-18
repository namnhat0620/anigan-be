export class User {
    firstName: string
    lastName: string
    email: string
    username: string
    credentials: { type: string; value: string; temporary: boolean; }[]

    constructor(data: any) {
        this.firstName = data?.firstName;
        this.lastName = data?.lastName;
        this.email = data?.email;
        this.username = data?.username;
        this.credentials = [{
            type: "password",
            value: data.password,
            temporary: false
        }]
    }
}