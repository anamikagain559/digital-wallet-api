import { z } from "zod";
export declare const depositSchema: z.ZodObject<{
    amount: z.ZodNumber;
}, z.core.$strip>;
export declare const withdrawSchema: z.ZodObject<{
    amount: z.ZodNumber;
}, z.core.$strip>;
export declare const transferSchema: z.ZodObject<{
    toUserId: z.ZodString;
    amount: z.ZodNumber;
}, z.core.$strip>;
export declare const agentCashInSchema: z.ZodObject<{
    userId: z.ZodString;
    amount: z.ZodNumber;
}, z.core.$strip>;
export declare const agentCashOutSchema: z.ZodObject<{
    userId: z.ZodString;
    amount: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=wallet.validation.d.ts.map