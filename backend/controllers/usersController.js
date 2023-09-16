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

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({msg: "User Not Found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({msg: "Invalid Credentials"});
        }

        const payload = {
            user: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 360000});

        res.cookie("token", token, {httpOnly: true, expiresIn: 360000});

        const {password: pass, ...rest} = user._doc; // this is we have taken out the password and saved the other details in the rest variable, this is so that we don't send the password to the client

        res.status(200).json({msg: "User Logged In Successfully", user: rest});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({msg: "User Logged Out Successfully"});
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({msg: "User Not Found"});
        }
        const {password: pass, ...rest} = user._doc;
        return res.status(200).json({msg: "User Found", user: rest});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
};

export const updateDetails = async (req, res) => {
    const {name, email, age} = req.body;

    try {
        let user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({msg: "User Not Found"});
        }

        let exists = await User.findOne({email});
        if(exists && exists._id.toString() !== user._id.toString()) {
            return res.status(400).json({msg: "Email Already Exists"});
        }

        user.name = name;
        user.email = email;
        user.age = age;

        await user.save();

        const {password: pass, ...rest} = user._doc;
        return res.status(200).json({msg: "User Updated Successfully", user: rest});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
};

export const updatePassword = async (req, res) => {
    const {password, newPassword} = req.body;

    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({msg: "User Not Found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({msg: "Invalid Credentials"});
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        const {password: pass, ...rest} = user._doc;
        return res.status(200).json({msg: "Password Updated Successfully", user: rest});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({msg: "User Not Found"});
        }
        await user.remove();
        return res.status(200).json({msg: "User Deleted Successfully"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
};