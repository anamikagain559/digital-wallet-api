import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";
export declare const UserServices: {
    createUser: (payload: Partial<IUser>) => Promise<import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllUsers: () => Promise<{
        data: (import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
        };
    }>;
    updateUser: (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => Promise<(import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=user.service.d.ts.map