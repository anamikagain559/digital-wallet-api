import { Types } from "mongoose";
export declare enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
}
/**
 * email, password
 * google authentication
 */
export interface IAuthProvider {
    provider: string;
    providerId: string;
}
export declare enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isActive?: IsActive;
    isVerified?: boolean;
    role: Role;
    auths: IAuthProvider[];
    bookings?: Types.ObjectId[];
    guides?: Types.ObjectId[];
}
//# sourceMappingURL=user.interface.d.ts.map