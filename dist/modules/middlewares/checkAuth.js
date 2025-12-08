"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const env_1 = require("./../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const jwt_1 = require("../../utils/jwt");
const user_model_1 = require("../../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../user/user.interface");
const checkAuth = (...authRoles) => async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        if (!accessToken) {
            throw new AppError_1.default(403, "No Token Recieved");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const isUserExist = await user_model_1.User.findOne({ email: verifiedToken.email });
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
        }
        console.log("verifiedToken", verifiedToken);
        console.log(authRoles);
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(403, "You are not permitted to view this route!!!");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log("jwt error", error);
        next(error);
    }
};
exports.checkAuth = checkAuth;
