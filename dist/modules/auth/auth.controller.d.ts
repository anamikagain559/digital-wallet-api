import { NextFunction, Request, Response } from "express";
export declare const AuthControllers: {
    credentialsLogin: (req: Request, res: Response, next: NextFunction) => void;
    getNewAccessToken: (req: Request, res: Response, next: NextFunction) => void;
    logout: (req: Request, res: Response, next: NextFunction) => void;
    resetPassword: (req: Request, res: Response, next: NextFunction) => void;
    googleCallbackController: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=auth.controller.d.ts.map