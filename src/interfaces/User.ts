import { USER_ROLES } from "../constants";
export interface IUser {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string,
    password: string,
    role: USER_ROLES;
}