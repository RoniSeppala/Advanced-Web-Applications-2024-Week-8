import { Router, Request, Response } from 'express';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';

const router:Router = Router();

router.post('/register', async (req: Request, res: Response) => {
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

    } catch (error) {
        console.error('Error in registration', error)
        res.status(500).json({error: 'Internal server error'})
        return
    }
});

export default router