import express from "express";
import { register, login, logout, getMe, updateDetails, updatePassword, deleteUser, upload, handleUpload} from "../controllers/usersController.js"
import authorize from "../middleware/authorize.js";
import { loginRules, registerRules, updateDetailsRules, updatePasswordRules } from "../middleware/validator.js";
import { validateResult } from "../middleware/validationResults.js";

const router = express.Router();

router.post("/register", upload.single("my_file"), registerRules, validateResult, register);

router.post("/login", loginRules, validateResult, login);

router.get("/logout", authorize, logout);

router.get("/me", authorize, getMe);

router.put("/updateDetails", authorize, upload.single("my_file"), updateDetailsRules, validateResult, updateDetails);

router.put("/updatepassword", authorize, updatePasswordRules, validateResult, updatePassword);

router.delete("/delete/:id", authorize, deleteUser);


export default router;
