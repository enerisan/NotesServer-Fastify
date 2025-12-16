import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../interfaces/User'
import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs';
import UserModel from '../models/User';
import validator from 'validator';
import { USER_ROLES } from '../constants';

dotenv.config();


const generateToken = (user: IUser) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
    )
};



export default {
    //REGISTER
    async register(req: FastifyRequest<{ Body: IUser }>, reply: FastifyReply) {
        try {
            const { firstname, lastname, email, password, role } = req.body;

            if (!email || !password || !role) {
                return reply
                    .status(StatusCodes.BAD_REQUEST)
                    .send({ message: "MISSING_REQUIRED_FIELDS" })
            }

            let user = await UserModel.findOne({ email });

            const hashedPassword = await bcrypt.hash(password, 10)

            /*         if (user) {
                        user.firstname = firstname;
                        user.lastname = lastname;
                        user.password = hashedPassword;
                        await user.save();
        
                        return reply.status(StatusCodes.OK).send({
                            user: {
                                firstname: user.firstname,
                                lastname: user.lastname,
                                email: user.email,
                            }
                        });
                    }
         */
            if (user) {
                return reply.status(StatusCodes.CONFLICT).send({ message: "EMAIL_ALREADY_IN_USE" })
            }

            if (role === USER_ROLES.ADMIN) {
                return reply.status(StatusCodes.UNAUTHORIZED).send({ message: "USER_NOT_AUTHORIZED" })
            }

            const emailNorm = validator.normalizeEmail(email);

            user = await UserModel.create(
                {
                    firstname,
                    lastname,
                    email: emailNorm,
                    password: hashedPassword,
                    role

                }
            )

            return reply.status(StatusCodes.CREATED).send({
                user: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                }
            });


        } catch (error) {
            reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "INTERNAL_SERVER_ERROR", error });
        }
    }
}