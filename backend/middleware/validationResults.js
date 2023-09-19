import { validationResult } from "express-validator";

export const validateResult = (req, res, next) => {
    const errors = validateResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({msg: errors.array()[0].msg});
    }
    next();
}