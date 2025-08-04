import express from 'express';
import type { Request, Response } from "express";
import type { Application } from 'express'; 
import { Server } from 'http';

import mongoose from 'mongoose';

const app: Application = express();
let server: Server;
const port = 5000;

async function main() {
  try {

    await mongoose.connect('mongodb+srv://anamikagain8:1xvOREUhSh2qWGyq@cluster0.o6amai6.mongodb.net/ture-management-db?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');
      server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

main();

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
})