import { JwtPayload } from "jsonwebtoken";
export declare const AuthServices: {
    getNewAccessToken: (refreshToken: string) => Promise<{
        accessToken: string;
    }>;
    resetPassword: (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map