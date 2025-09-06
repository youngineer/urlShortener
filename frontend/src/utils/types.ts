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

export interface IAlertInfo {
    isError: boolean;
    message: string;
}

export interface IUrl {
    id: number;
    name: string;
    shortUrl: string;
    longUrl: string;
    customUrl: string;
}

export type IUrlEntry = Omit<IUrl, 'id'>;
export type IUrlMap = Map<number, IUrlEntry>;