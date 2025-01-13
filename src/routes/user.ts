import { Router, Request, Response } from 'express';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { registerValidation, loginValidation } from '../validators/inputValidation';
import { Result, ValidationError, validationResult } from 'express-validator';

const router:Router = Router();

router.post('/register',registerValidation, async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors)
        res.status(400).json({errors: errors.array()})
        return
    }

    try {
        const existingUser: IUser | null = await User.findOne({email: req.body.email})

        if (existingUser) {
            res.status(403).send("Email already in use")
            return
        }

        const salt: string = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(req.body.password, salt);

        const newUser: IUser = new User({
            email: req.body.email,
            password: hash,
            username: req.body.username,
            isAdmin: req.body.isAdmin
        })

        await newUser.save()
        
        res.status(200).json(newUser)
        return

    } catch (error: any) {
        console.error('Error in registration', error)
        res.status(500).json({error: 'Internal server error'})
        return
    }
});

router.post('/login',loginValidation, async (req: Request, res: Response) => {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors)
        res.status(400).json({errors: errors.array()})
        return
    }

    try {
        const user: IUser | null = await User.findOne({email: req.body.email})

        if (!user) {
            res.status(404).json({"message":"Login failed"})
            return
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.status(401).json({"message":"Login failed"})
            return
        }

        const payload: JwtPayload = {
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin
        }

        const token: string = jwt.sign(payload, process.env.JWT_SECRET as string, {expiresIn: '5m'})

        res.status(200).json({token: token})

    } catch (error: any) {
        console.error('Error in login', error)
        res.status(500).json({error: 'Internal server error'})
        return
    }
});


export default router