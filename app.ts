import express, { Express } from 'express';
import path from "path"
import userRouter from "./src/routes/user"
import topicsRouter from "./src/routes/topics"
import dotenv from "dotenv"
import mongoose, {Connection} from 'mongoose';
import morgan from 'morgan';

dotenv.config()

const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 3000;

const mongoDB: string = process.env.MONGODB_URI as string || 'mongodb://localhost:27017/testdb';
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection


db.on("error", console.error.bind(console, "MongoDB connection error"))


app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/user', userRouter);
app.use('/api/', topicsRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)

})