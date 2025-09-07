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
    qrCode?: String
}

export type IUrlEntry = Omit<IUrl, 'id'>;
export type IUrlMap = Map<number, IUrlEntry>;

export interface IEditUrl {
    id: number;
    url: IUrlEntry;
    isEdit: boolean;
    onSave?: (id: number, url: IUrlEntry) => Promise<void>;
}