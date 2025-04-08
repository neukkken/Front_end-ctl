export interface IUser {
    _id: string;
    name: string;
    email: string;
}

export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    user: IUser;
};

export type ApiError = {
    message: string;
};