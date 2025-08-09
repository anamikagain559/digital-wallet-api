import express, { Application, Request, Response } from 'express';
import { UserRoutes } from './modules/user/user.route';
import { router } from "./routes/index";
import cors from "cors";
import { globalErrorHandler } from "./modules/middlewares/globalErrorHandler";
import notFound from "./modules/middlewares/notFound";
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Tour Management System Backend',
  });
});
app.use(globalErrorHandler)
app.use(notFound)
export default app;