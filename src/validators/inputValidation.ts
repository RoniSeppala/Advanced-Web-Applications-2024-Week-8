import {Request, Response, NextFunction} from "express"
import { body } from "express-validator"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const registerValidation = [
    body('email').isEmail().normalizeEmail().trim().escape(),
    body('password').isLength({min: 8})
                    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
                    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
                    .matches(/\d/).withMessage('Password must contain at least one number')
                    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
                    .trim()
                    .escape(),
    body('username').optional().isLength({min:3, max:25}).trim().escape(),
    body('isAdmin').optional().isBoolean().escape()
]

export const loginValidation = [
    body('email').isEmail().normalizeEmail().trim().escape(),
    body('password').trim().escape(),
    body('username').optional().trim().escape(),
    body('isAdmin').optional().isBoolean().escape()
]

interface CustomRequest extends Request {
    user?: JwtPayload
}

export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('authorization')?.split(" ")[1]
    console.log('Token:', token)

    if (!token) {
        res.status(401).send('Token not found')
        return
    }

    try {
        const verified: JwtPayload = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload
        req.user = verified
        next()
    } catch (error) {
        console.error('Error in verifyToken', error)
        res.status(400).send('Invalid token')
        return
    }
}

export const verifyAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {  //TODO: admin verification might not work
    if (!req.user?.isAdmin) {
        res.status(403).send('Access denied')
        return
    }
    next()
}