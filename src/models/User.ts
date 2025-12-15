import { Schema, model} from "mongoose";
import { IUser } from "../interfaces/User"
import { USER_ROLES } from "../constants";

const UserSchema = new Schema<IUser>({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: Object.values(USER_ROLES), required: true }
})

// Create a Mongoose model named 'User' based on the UserSchema.
// This model represents the 'users' collection in MongoDB and provides
// methods to interact with it (e.g., find, create, update, delete).
const UserModel = model('User', UserSchema);
export default UserModel;