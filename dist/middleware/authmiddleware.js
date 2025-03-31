"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const tokenHeader = req.headers["authorization"];
    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
        res.status(401).json({
            message: "Authorisation Failed. Please login again"
        });
        return;
    }
    const token = tokenHeader === null || tokenHeader === void 0 ? void 0 : tokenHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        //@ts-ignore
        req.userId = decoded.userId;
        next();
    }
    catch (_a) {
        res.status(401).json({
            message: "Invalid Token"
        });
    }
};
exports.authMiddleware = authMiddleware;
