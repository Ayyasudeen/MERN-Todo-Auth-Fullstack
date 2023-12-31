import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Todo from "../models/Todo.js";
import multer from "multer";
import {v2 as cloudinary} from 'cloudinary';
import dotenv from "dotenv";
import sendEmail from "../utils/email.js";

dotenv.config();

export const register = async (req, res) => {
    const {name, email, password, age} = req.body;
    let imageUrl = null;
    let imageId = null;
    try {
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const image = await cloudinary.uploader.upload(dataURI, {
                resource_type: "auto",
                folder: "todo_profile_pic"
            });
            imageUrl = image.secure_url;
            imageId = image.public_id;
        }
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
            profilepic: imageUrl ? imageUrl : null,
            profilepicId: imageId ? imageId : null,
        });
        await user.save();

        const payload = {
            user: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 360000});
      
          const message = `${process.env.BASE_URL}/users/verify/${user._id}/${token}`;
          await sendEmail(user.email, "Verify Email", message);
      
          
          res.cookie("token", token, {httpOnly: true, expiresIn: 360000});
          
          const {password: pass, _id: id, ...rest} = user._doc; // this is we have taken out the password and saved the other details in the rest variable, this is so that we don't send the password to the client
          
          res.status(201).json({msg: "An Email sent to your account please verify", user: rest});
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

        if (!user.verified) {
            return res.status(400).json({msg: "Not Verified"});
        }

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
    const {name, email, age, prevImgId} = req.body;
    let imageUrl = null;
    let imageId = null;
    try {
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const image = await cloudinary.uploader.upload(dataURI, {
                resource_type: "auto",
                folder: "todo_profile_pic"
            });
            cloudinary.uploader.destroy(prevImgId);
            imageUrl = image.secure_url;
            imageId = image.public_id;
        }


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
        if (imageUrl) {
            user.profilepic = imageUrl;
            user.profilepicId = imageId;

        }

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
    const { id } = req.params;
    const imageid = 'todo_profile_pic/' + id; 
    try {
        cloudinary.uploader.destroy(imageid);
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({msg: "User Not Found"});
        }
        const todo = await Todo.find({user: req.user});
        if (todo) {
            await Todo.deleteMany({user: req.user});
        }
        res.clearCookie("token");
        await user.deleteOne();
        return res.status(200).json({msg: "User Deleted Successfully"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
};

const storage = new multer.memoryStorage();
export const upload = multer({
storage,
});

export const handleUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const image = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
            folder: "todo_profile_pic"
        });
        return res.status(200).json({msg: "Profile Image Updated Successfully", data: image});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
}

export const verifyUser = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) return res.status(400).send("Invalid link");
  
    //   const token = await Token.findOne({
    //     userId: user._id,
    //     token: req.params.token,
    //   });
    //   if (!token) return res.status(400).send("Invalid link");
  
      user.verified = true;
      await user.save();
    //   await Token.findByIdAndRemove(token._id);
  
      res.send("email verified sucessfully");
     } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
};

