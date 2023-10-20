import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    profilepic: {
        type: String,
        required: false,
    },
    profilepicId: {
        type: String,
        required: false,
    }

}, {timestamps: true});

const User = mongoose.model("User", UserSchema);

export default User;
