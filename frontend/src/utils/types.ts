export interface ILogin {
    emailId: string;
    password: string
}

export interface ISignup extends ILogin{
    confirmPassword: string;
}

export interface IBackendResponseDto {
    message: string;
    content: object
}