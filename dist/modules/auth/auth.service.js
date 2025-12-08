"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const userTokens_1 = require("../../utils/userTokens");
const user_model_1 = require("../user/user.model");
// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;
//     const isUserExist = await User.findOne({ email })
//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
//     }
//     const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
//     if (!isPasswordMatched) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
//     }
//     // const jwtPayload = {
//     //     userId: isUserExist._id,
//     //     email: isUserExist.email,
//     //     role: isUserExist.role
//     // }
//     // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
//     // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)
//     const userTokens = createUserTokens(isUserExist)
//     // delete isUserExist.password;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: pass, ...rest } = isUserExist.toObject()
//     return {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: rest
//     }
// }
const getNewAccessToken = async (refreshToken) => {
    const newAccessToken = await (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
};
const resetPassword = async (oldPassword, newPassword, decodedToken) => {
    const user = await user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old Password does not match");
    }
    user.password = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.save();
};
//user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token 
const changePassword = async (oldPassword, newPassword, decodedToken) => {
    const user = await user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old Password does not match");
    }
    user.password = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.save();
};
exports.AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword, changePassword
};
