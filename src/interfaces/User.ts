import { USER_ROLES } from "../constants";
import { FastifyRequest, FastifyReply } from 'fastify';

export interface IUser {
    _id?: string;
    firstname?: string;
    lastname?: string;
    email: string,
    password?: string,
    role: USER_ROLES;
}

