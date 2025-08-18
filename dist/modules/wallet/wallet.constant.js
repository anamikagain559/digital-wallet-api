"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WITHDRAW_FEE_PERCENT = exports.TRANSFER_FEE_PERCENT = exports.MIN_BALANCE = exports.MIN_TRANSFER_AMOUNT = exports.MIN_WITHDRAW_AMOUNT = exports.MIN_TOPUP_AMOUNT = exports.WalletStatus = void 0;
var WalletStatus;
(function (WalletStatus) {
    WalletStatus["ACTIVE"] = "ACTIVE";
    WalletStatus["BLOCKED"] = "BLOCKED";
})(WalletStatus || (exports.WalletStatus = WalletStatus = {}));
exports.MIN_TOPUP_AMOUNT = 10; // BDT
exports.MIN_WITHDRAW_AMOUNT = 20; // BDT
exports.MIN_TRANSFER_AMOUNT = 5; // BDT
exports.MIN_BALANCE = 0; // keep at least 0 BDT
exports.TRANSFER_FEE_PERCENT = 0.015; // 1.5%
exports.WITHDRAW_FEE_PERCENT = 0.01; // 1%
