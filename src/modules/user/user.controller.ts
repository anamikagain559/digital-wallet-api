

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { User } from "./user.model";
import { UserServices } from "./user.service";

const createUser =async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user =await UserServices.createUser(req.body);

        res.status(httpStatus.CREATED).json({
            message: "User Created Successfully",
            user    })
    }
    catch(err: any) {
        console.log(err);
       res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

export const UserController = {
    createUser,
};
