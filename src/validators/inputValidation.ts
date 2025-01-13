import { body } from "express-validator"

export const inputValidation = [
    body('email').isEmail().normalizeEmail().trim().escape(),
    body('password').isLength({min: 8})
                    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
                    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
                    .matches(/\d/).withMessage('Password must contain at least one number')
                    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
                    .trim()
                    .escape(),
    body('username').isLength({min:3, max:25}).trim().escape(),
    body('isAdmin').isBoolean().escape()
]