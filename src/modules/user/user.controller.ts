
import { Request, Response,NextFunction  } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { User } from "./user.model";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";

// const createUserFunction = async (req: Response, res: Response) => {

//     const user = await UserServices.createUser(req.body)

//     res.status(httpStatus.CREATED).json({
//         message: "User Created Successfully",
//         user
//     })
// }

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // throw new Error("Fake eror")
//         // throw new AppError(httpStatus.BAD_REQUEST, "fake error")

//         // createUserFunction(req, res)

//     } catch (err: any) {
//         console.log(err);
//         next(err)
//     }
// }
const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserServices.createUser(req.body)

    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })
})
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    if (!userId) {
        throw new Error("User ID is required");
    }
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    })
})

const createAgent = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { email, name, password } = req.body;

    // Optional: Only allow certain roles (like SUPER_ADMIN) to create agents
    if (req.user!.role !== Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to create an agent");
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "User with this email already exists");
    }

    // Create the agent
    const agent = await User.create({
      email,
      name,
      password,
      role: Role.AGENT,

    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Agent created successfully",
      data: agent
    });

  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
    createAgent

}