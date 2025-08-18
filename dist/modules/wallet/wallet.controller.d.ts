import { Request, Response } from "express";
export declare const WalletController: {
    create: (req: Request, res: Response) => Promise<void>;
    getMyWallet: (req: Request, res: Response) => Promise<void>;
    getAll: (req: Request, res: Response) => Promise<void>;
    block: (req: Request, res: Response) => Promise<void>;
    unblock: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
    me: (req: Request, res: Response) => Promise<void>;
    deposit: (req: Request, res: Response) => Promise<void>;
    withdraw: (req: Request, res: Response) => Promise<void>;
    transfer: (req: Request, res: Response) => Promise<void>;
    agentCashIn: (req: Request, res: Response) => Promise<void>;
    agentCashOut: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=wallet.controller.d.ts.map