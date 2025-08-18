import z from "zod";
export declare const createUserZodSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateUserZodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    isActive: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    isDeleted: z.ZodOptional<z.ZodBoolean>;
    isVerified: z.ZodOptional<z.ZodBoolean>;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=user.validation.d.ts.map