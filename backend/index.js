import express from "express";
import dotenv from "dotenv";
import connectionDB from "./database/connectionDB.js";
import cookieParser from "cookie-parser"
import {v2 as cloudinary} from 'cloudinary';

import todosRoutes from "./routes/todos.js"
import usersRoutes from "./routes/users.js"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const app = express();

dotenv.config();

connectionDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/todos", todosRoutes);
app.use("/api/users", usersRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
})
