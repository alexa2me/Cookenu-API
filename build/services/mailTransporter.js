"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const mailTransporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: { ciphers: "SSLv3" },
});
exports.default = mailTransporter;
