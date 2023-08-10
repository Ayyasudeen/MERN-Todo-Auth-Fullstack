import User from "../models/User.js";
import Todo from "../models/Todo.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    const {name, email, password, age} = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: "User Already Exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({
            name, 
            email, 
            password: hashedPassword,
            age,
        });
        await user.save();

        const payload = {
            user: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 360000});

        res.cookie("token", token, {httpOnly: true, expiresIn: 360000});

        const {password: pass, ...rest} = user._doc; // this is we have taken out the password and saved the other details in the rest variable, this is so that we don't send the password to the client

        res.status(201).json({msg: "User Created Successfully", user: rest});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
};

export const login = async (req, res) => {};

export const logout = async (req, res) => {};

export const getMe = async (req, res) => {};

export const updateDetails = async (req, res) => {};

export const updatePassword = async (req, res) => {};

export const deleteUser = async (req, res) => {};