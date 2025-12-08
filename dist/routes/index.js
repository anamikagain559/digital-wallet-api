"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const transaction_route_1 = __importDefault(require("../modules/transaction/transaction.route"));
const otp_route_1 = require("../modules/otp/otp.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/wallet",
        route: wallet_route_1.WalletRoutes
    },
    {
        path: "/transaction",
        route: transaction_route_1.default
    }, {
        path: "/otp",
        route: otp_route_1.OtpRoutes
    },
    // {
    //     path: "/tour",
    //     route: TourRoutes
    // },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
// router.use("/user", UserRoutes)
// router.use("/tour", TourRoutes)
// router.use("/division", DivisionRoutes)
// router.use("/booking", BookingRoutes)
// router.use("/user", UserRoutes)
