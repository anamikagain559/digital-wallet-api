const express = require('express');
import { Server } from 'http';

import mongoose from 'mongoose';
import app from './app';


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

/**  unhandled rejection error
* uncaugth rejection error
* signal termination  sigterm
* 
*/
process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})


process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejecttion detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

// Unhandler rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// Uncaught Exception Error
// throw new Error("I forgot to handle this local erro")


