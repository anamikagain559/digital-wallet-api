"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_service_1 = require("./user.service");
const user_model_1 = require("./user.model");
const user_interface_1 = require("../user/user.interface");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
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
const createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await user_service_1.UserServices.createUser(req.body);
    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Created Successfully",
        data: user,
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        throw new Error("User ID is required");
    }
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
});
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
});
const createAgent = async (req, res, next) => {
    try {
        const { email, name, password } = req.body;
        // if (!req.user || req.user.role !== Role.ADMIN) {
        //   throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to create an agent");
        // }
        console.log("req.user", req.user);
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User with this email already exists");
        }
        const agent = await user_model_1.User.create({
            email,
            name,
            password,
            role: user_interface_1.Role.AGENT,
        });
        res.status(http_status_codes_1.default.CREATED).json({
            success: true,
            message: "Agent created successfully",
            data: agent
        });
    }
    catch (error) {
        next(error);
    }
};
exports.UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
    createAgent
};
