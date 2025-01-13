import { Router, Request, Response } from 'express';
import { IUser } from '../models/User'; // Assuming you have a User model
import { Topic, ITopic } from '../models/Topic';
import { verifyToken, verifyAdmin } from '../validators/inputValidation';
interface CustomRequest extends Request {
    user?: IUser;
}

const router:Router = Router();


router.post('/topic', verifyToken, async (req: CustomRequest, res: Response) => {
    try {
        if (!req.body.title || !req.body.content) {
            res.status(400).json({message: 'Title and content are required.'})
            return
        }

        const newTopic: ITopic = new Topic({
            title: req.body.title,
            content: req.body.content,
            username: req.user?.username
        })

        await newTopic.save()

        res.status(200).json({"message": "Topic created successfully."})
        return

    } catch (error) {
        console.error('Error in posting', error)
        res.status(500).json({message: 'Internal server error'})
        return
    }
})

router.get('/topics', async (req: Request, res: Response) => {
    try {
        const topics: ITopic[] = await Topic.find()
        res.status(200).json(topics)
        return

    } catch (error) {
        console.error('Error in fetching topics', error)
        res.status(500).json({message: 'Internal server error'})
        return
    }
})

router.delete('topic/:id',verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    console.log("detel beginging")
    const id: string = req.params.id as string
    console.log("id",id)

    try {
        const topic: ITopic | null = await Topic.findById(id)
        console.log("topic",topic)

        if (!topic) {
            res.status(404).json({message:'Topic not found'})
            return
        }

        await Topic.findByIdAndDelete(id)
        res.status(200).json({message:'Topic deleted successfully.'})
        return

    } catch (error: any) {
        console.error('Error in topic deletion', error)
        res.status(500).json({message: 'Internal server error'})
        return
    }
})

export default router;