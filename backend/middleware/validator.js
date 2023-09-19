import {check} from "express-validator";

export const registerRules = [
    check("name", "Name is Required").notEmpty().trim().escape(),
    check("email", "Please give valid Email").isEmail().normalizeEmail(),
    check("password", "Password should be 6 or more characters").isLength({min: 6}),
    check("age", "Age is Required").notEmpty().trim().escape().isNumeric(),
];

export const loginRules = [
    check("email", "Please give valid Email").isEmail().normalizeEmail(),
    check("password", "Password should be 6 or more characters").isLength({min: 6}),
];

export const updateDetailsRules = [
    check("name", "Name is Required").notEmpty().trim().escape(),
    check("email", "Please give valid Email").isEmail().normalizeEmail(),
    check("age", "Age is Required").notEmpty().trim().escape().isNumeric(),
];

export const updatePasswordRules = [
    check("password", "Password should be 6 or more characters").isLength({min: 6}),
    check("newPassword", "Password should be 6 or more characters").isLength({min: 6}),
];

