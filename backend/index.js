import express from "express";
import dotenv from "dotenv";
import connectionDB from "./database/connectionDB.js";

const app = express();

dotenv.config();

connectionDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
})
