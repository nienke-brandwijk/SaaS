export class User {
    readonly id: number | undefined
    readonly username: string 
    readonly firstName: string
    readonly lastName: string
    readonly password: string
    readonly email: string

    constructor( user: {id?: number, username: string, firstName: string, lastName: string, password: string, email: string}) {
        this.id = user.id;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName; 
        this.password = user.password; 
        this.email = user.email;
    }
}