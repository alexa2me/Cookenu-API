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
const connection_1 = __importDefault(require("../data/connection"));
const userAccessQueries_1 = require("../data/userAccessQueries");
const authenticator_1 = require("../services/authenticator");
const hashManager_1 = require("../services/hashManager");
const idGenerator_1 = require("../services/idGenerator");
const mailTransporter_1 = __importDefault(require("../services/mailTransporter"));
const user_1 = require("../types/user");
class UserAccessController {
    constructor() {
        this.controlCreateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, role } = req.body;
                if (!name || !email || !password || !role) {
                    res.statusCode = 422;
                    throw new Error("Preencha todos os campos: 'name', 'email', 'password' and 'role'.");
                }
                if (!(role in user_1.USER_ROLES)) {
                    throw new Error("Role must be NORMAL or ADMIN.");
                }
                if (!email.includes("@")) {
                    throw new Error("Invalid email :/");
                }
                if (password.length < 6) {
                    throw new Error("Password must have at least 6 characters");
                }
                const [user] = yield (0, connection_1.default)("users").where({ email });
                if (user) {
                    res.statusCode = 409;
                    throw new Error("Email já está cadastrado!");
                }
                const newUser = {
                    id: (0, idGenerator_1.generateId)(),
                    name,
                    email,
                    password: (0, hashManager_1.generateHash)(password),
                    role,
                };
                const token = (0, authenticator_1.generateToken)({
                    id: newUser.id,
                    role: newUser.role,
                });
                yield (0, userAccessQueries_1.createUser)(newUser);
                res.status(200).send({ access_token: token });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
        this.controlLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.statusCode = 422;
                    throw new Error("Please, fill all fields: email and password.");
                }
                if (!email.includes("@")) {
                    throw new Error("Invalid email :/");
                }
                const user = yield (0, userAccessQueries_1.login)(email, password);
                if (!user) {
                    throw new Error("User not found :/");
                }
                const passwordIsCorrect = (0, hashManager_1.compareHash)(password, user.password);
                if (!passwordIsCorrect) {
                    throw new Error("Invalid credentials :/");
                }
                const token = (0, authenticator_1.generateToken)({
                    id: user.id,
                    role: user.role,
                });
                res.status(200).send({ access_token: token });
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
        this.controlResetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const [user] = yield (0, connection_1.default)("users").where({ email });
                if (!user) {
                    res.statusCode = 400;
                    throw new Error("Please, check if your email is correct.");
                }
                const characters = "abcdefABCDEF12345!@#$%&*";
                let newPassword = "";
                for (let i = 0; i < 10; i++) {
                    const index = Math.floor(Math.random() * (characters.length - 1));
                    newPassword += characters[index];
                }
                const newHash = (0, hashManager_1.generateHash)(newPassword);
                yield (0, userAccessQueries_1.resetPassword)(newHash, email);
                const info = yield mailTransporter_1.default.sendMail({
                    from: `<${process.env.NODEMAILER_USER}>`,
                    to: email,
                    subject: "Teste 1 de nodemailer",
                    text: `Sua nova senha é ${newPassword}`,
                    html: `<p>Sua nova senha é <strong>${newPassword}</strong></p>`,
                });
                console.log({
                    newPassword,
                    oldHash: user.password,
                    newHash: newHash,
                    info,
                });
                res.send(200);
            }
            catch (err) {
                res.status(400).send({
                    message: err.message,
                });
            }
        });
    }
}
exports.default = UserAccessController;
