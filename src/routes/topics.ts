import { Router, Request, Response } from 'express';

const router:Router = Router();


router.post('/', (req: Request, res: Response) => {

})

router.get('/', (req: Request, res: Response) => {

})

router.delete('/:id', (req: Request, res: Response) => {
    const id: string = req.params.id as string
})

export default router;