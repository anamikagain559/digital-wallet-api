import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import passport from "passport";
import { envVars } from "./config/env";
import "./config/passport";
import { globalErrorHandler } from "./modules/middlewares/globalErrorHandler";
import notFound from "./modules/middlewares/notFound";
import { router } from "./routes";

const app = express()


app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
})


app.use(globalErrorHandler)

app.use(notFound)

export default app