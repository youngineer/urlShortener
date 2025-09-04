export interface ILogin {
    emailId: string;
    password: string
}

export interface ISignup extends ILogin{
    name: string;
    confirmPassword: string;
}