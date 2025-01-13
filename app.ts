import express, { Express } from 'express';
import path from "path"
import router from "./src/routes/user"
import dotenv from "dotenv"
import mongoose, {Connection} from 'mongoose';

dotenv.config()

const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 3000;

const mongoDB: string = process.env.MONGODB_URI as string || 'mongodb://127.0.0.1:27017/testdb';
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/user', router);