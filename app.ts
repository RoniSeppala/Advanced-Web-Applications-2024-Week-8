import express, { Express } from 'express';
import path from "path"
import router from "./src/routes/user"
import dotenv from "dotenv"

dotenv.config()

const app: Express = express();
const port: number = parseInt(process.env.PORT as string) || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/user', router);