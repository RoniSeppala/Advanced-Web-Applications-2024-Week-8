import { Router, Request, Response } from 'express';
import { IUser } from '../models/User'; // Assuming you have a User model
import { Topic, ITopic } from '../models/Topic';
import { verifyToken, verifyAdmin } from '../validators/inputValidation';
interface CustomRequest extends Request {
    user?: IUser;
}

const router:Router = Router();


router.post('/', verifyToken, (req: CustomRequest, res: Response) => {
    try {
        const newTopic: ITopic = new Topic({
            title: req.body.title,
            content: req.body.content,
            username: req.user?.username
        })

        newTopic.save()

        res.status(200).json(newTopic)

    } catch (error) {
        console.error('Error in posting', error)
        res.status(500).json({error: 'Internal server error'})
        return
    }
})

router.get('/', (req: Request, res: Response) => {

})

router.delete('/:id', (req: Request, res: Response) => {
    const id: string = req.params.id as string
})

export default router;