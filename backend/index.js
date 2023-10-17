import express from "express";
import dotenv from "dotenv";
import connectionDB from "./database/connectionDB.js";
import cookieParser from "cookie-parser"

import todosRoutes from "./routes/todos.js"
import usersRoutes from "./routes/users.js"
import cors from 'cors';

const app = express();

dotenv.config();

connectionDB();

app.use(cors());
app.use(cors({
    origin: 'https://mern-todo-jlo7tqi7i-ayyasudeen.vercel.app/'
  }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/todos", todosRoutes);
app.use("/api/users", usersRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
})
