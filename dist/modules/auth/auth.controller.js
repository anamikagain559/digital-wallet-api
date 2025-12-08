"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = exports.updateProfile = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const setCookie_1 = require("../../utils/setCookie");
const userTokens_1 = require("../../utils/userTokens");
const auth_service_1 = require("./auth.service");
const credentialsLogin = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    passport_1.default.authenticate("local", async (err, user, info) => {
        if (err) {
            return next(new AppError_1.default(401, err));
        }
        if (!user) {
            return next(new AppError_1.default(401, info.message));
        }
        const userTokens = await (0, userTokens_1.createUserTokens)(user);
        const { password: pass, ...rest } = user.toObject();
        (0, setCookie_1.setAuthCookie)(res, userTokens);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            },
        });
    })(req, res, next);
});
const getNewAccessToken = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refresh token recieved from cookies");
    }
    const tokenInfo = await auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged Out Successfully",
        data: null,
    });
});
const changePassword = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await auth_service_1.AuthServices.changePassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Changed Successfully",
        data: null,
    });
});
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    await auth_service_1.AuthServices.resetPassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Changed Successfully",
        data: null,
    });
});
const googleCallbackController = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    const tokenInfo = (0, userTokens_1.createUserTokens)(user);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
});
exports.updateProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const updateData = req.body;
    const updatedUser = await auth_service_1.AuthServices.updateProfile(userId, updateData);
    if (!updatedUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
    });
});
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController,
    updateProfile: exports.updateProfile,
    changePassword
};
