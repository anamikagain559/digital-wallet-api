import { Router } from "express"
import { AuthRoutes } from "../modules/auth/auth.route"
import { UserRoutes } from "../modules/user/user.route"

import { WalletRoutes } from "../modules/wallet/wallet.route"
import  txRouter from "../modules/transaction/transaction.route"
import { OtpRoutes } from "../modules/otp/otp.route"
export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/wallet",
        route: WalletRoutes
    },
    {
         path: "/transaction",
        route: txRouter 
    }, {
        path: "/otp",
        route: OtpRoutes
    },

    // {
    //     path: "/tour",
    //     route: TourRoutes
    // },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

// router.use("/user", UserRoutes)
// router.use("/tour", TourRoutes)
// router.use("/division", DivisionRoutes)
// router.use("/booking", BookingRoutes)
// router.use("/user", UserRoutes)