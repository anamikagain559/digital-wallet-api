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
const transaction_model_1 = require("../transaction/transaction.model");
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
    console.log("userId in controller:", userId);
    if (!userId) {
        throw new Error("User ID is required");
    }
    console.log("req.user in controller:", req.user);
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body;
    console.log("Payload in controller:", payload);
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
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK, // ✅ FIXED
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta: result.meta
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const result = await user_service_1.UserServices.getMe(decodedToken.userId);
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
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
const blockOrUnblockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body || {};
        console.log("isActive", isActive);
        if (isActive === undefined) {
            return res.status(400).json({
                success: false,
                message: "isActive is required"
            });
        }
        const updatedUser = await user_model_1.User.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: `User status updated to ${isActive}`,
            data: updatedUser,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
const getAdminAnalytics = async (req, res, next) => {
    try {
        // Total users (all users except admin maybe)
        const totalUsers = await user_model_1.User.countDocuments({ role: "USER" });
        console.log("totalUsers", totalUsers);
        const totalAgents = await user_model_1.User.countDocuments({ role: "AGENT" });
        // Total transactions count
        const totalTransactions = await transaction_model_1.TransactionModel.countDocuments();
        // Total transaction volume
        const totalVolume = await transaction_model_1.TransactionModel.aggregate([
            { $group: { _id: null, sum: { $sum: "$amount" } } },
        ]);
        // Transactions grouped by date
        const transactionsOverTime = await transaction_model_1.TransactionModel.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    volume: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.json({
            success: true,
            data: {
                totalUsers,
                totalAgents,
                totalTransactions,
                totalVolume: totalVolume[0]?.sum || 0,
                transactionsOverTime,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
const approveAgent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent ID is required");
    }
    const agent = await user_model_1.User.findById(id);
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
    if (agent.role !== user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This user is not an agent");
    }
    // Approve agent
    agent.isVerified = true;
    agent.isActive = user_interface_1.IsActive.ACTIVE; // Optional but recommended
    await agent.save();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Agent approved successfully",
        data: agent,
    });
});
const suspendAgent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent ID is required");
    }
    const agent = await user_model_1.User.findById(id);
    if (!agent) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Agent not found");
    }
    if (agent.role !== user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This user is not an agent");
    }
    // Suspend agent
    agent.isVerified = false;
    agent.isActive = user_interface_1.IsActive.INACTIVE;
    await agent.save();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Agent suspended successfully",
        data: agent,
    });
});
const getAdminOverview = async (req, res) => {
    try {
        // Count normal users
        const totalUsers = await user_model_1.User.countDocuments({ role: "user" });
        // Count agents
        const totalAgents = await user_model_1.User.countDocuments({ role: "agent" });
        // Count transactions
        const totalTransactions = await transaction_model_1.TransactionModel.countDocuments();
        // Sum transaction amounts
        const volumeAgg = await transaction_model_1.TransactionModel.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
        ]);
        const totalVolume = volumeAgg[0]?.totalAmount || 0;
        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalAgents,
                totalTransactions,
                totalVolume,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};
exports.UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
    createAgent,
    getMe,
    getAdminAnalytics,
    blockOrUnblockUser,
    approveAgent,
    suspendAgent,
    getAdminOverview
};
