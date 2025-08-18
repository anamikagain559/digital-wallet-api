import { Request, Response, NextFunction } from "express";
export declare const UserControllers: {
    createUser: (req: Request, res: Response, next: NextFunction) => void;
    getAllUsers: (req: Request, res: Response, next: NextFunction) => void;
    updateUser: (req: Request, res: Response, next: NextFunction) => void;
    createAgent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=user.controller.d.ts.map