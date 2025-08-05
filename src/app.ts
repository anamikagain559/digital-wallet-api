const express = require('express');
import type { Request, Response } from "express";
import type { Application } from 'express'; 

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
})

export default app;