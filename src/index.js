"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const authmiddleware_1 = require("./middleware/authmiddleware");
const mongoose_1 = __importDefault(require("mongoose"));
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, address, profilePicture, bio } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 5);
    try {
        yield db_1.userModel.create({
            email: email, password: hashedPassword, address: address, bio: bio, profile_picture_URL: profilePicture
        });
        res.status(200).json({
            message: "User succsesfully created"
        });
    }
    catch (_a) {
        res.status(401).json({
            message: "Unable to create user"
        });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.userModel.findOne({
            email: email
        });
        if (user) {
            const verify = yield bcrypt_1.default.compare(password, user.password);
            if (verify) {
                const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, config_1.JWT_SECRET);
                console.log(token);
                res.json({
                    token
                });
            }
            else {
                res.status(401).json({ message: "Wrong Credentials" });
                return;
            }
        }
    }
    catch (_a) {
        res.status(401).json({
            message: "User not found"
        });
        return;
    }
}));
app.get("/profile", authmiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    try {
        const user = db_1.userModel.findOne({
            _id: userId
        });
        res.json({
            //@ts-ignore
            email: user.email,
            //@ts-ignore
            bio: user.bio,
            //@ts-ignore
            address: user.address,
            //@ts-ignore
            profilePic: user.profile_picture_URL,
        });
    }
    catch (_a) {
        res.status(401).json({
            message: "Trable retrieving data"
        });
    }
}));
app.put("/update", authmiddleware_1.authMiddleware, (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const { bio, address, profile_picture_URL } = req.body;
    try {
        const user = db_1.userModel.findById({
            id: userId
        }, {
            bio, address, profile_picture_URL
        });
        res.json({
            message: "User succesfully updated"
        });
    }
    catch (_a) {
        res.status(401).json({
            message: "Unable to update user"
        });
    }
});
console.log(process.env.connection_string);
mongoose_1.default.connect(process.env.connection_string);
app.listen(3000);
