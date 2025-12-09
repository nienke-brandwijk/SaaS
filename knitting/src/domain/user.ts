export class User {
    readonly id: string | undefined
    readonly username: string 
    readonly firstName: string
    readonly lastName: string
    readonly password: string
    readonly email: string
    readonly learnProcess: number
    readonly imageUrl: string
    hasPremium: boolean;

    constructor( user: {id?: string, username: string, firstName: string, lastName: string, password: string, email: string, learnProcess: number, imageUrl: string, hasPremium?: boolean} ) {
        this.id = user.id;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName; 
        this.password = user.password; 
        this.email = user.email;
        this.learnProcess = user.learnProcess;
        this.imageUrl = user.imageUrl;
        this.hasPremium = user.hasPremium || false;
    }
}