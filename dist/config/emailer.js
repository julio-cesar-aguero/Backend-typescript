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
const nodemailer_1 = __importDefault(require("nodemailer"));
// const nodemailer = require("nodemailer");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const hostname = "hostname from account page";
        const username = "username from account page";
        const password = "password from account page";
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "92b08c96ee6f55",
                pass: "739a05dac15e90"
            },
            logger: true
        });
        const info = yield transporter.sendMail({
            from: '"Sender Name" <from@example.net>',
            to: "to@example.com",
            subject: "Hello from node",
            text: "Hello world?",
            html: "<strong>Hello world?</strong>",
            headers: { 'x-myheader': 'test header' }
        });
        console.log("Message sent: %s", info.response);
    });
}
