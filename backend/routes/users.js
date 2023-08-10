import express from "express";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get("/me", getMe);

router.put("/updateDetails", updateDetails);

router.put("/updatepassword", updatePassword);

router.delete("/delete", deleteUser);

export default router;
