"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const controller = new authController_1.authController();
class auth {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.post("/login", controller.loginUser);
        this.router.post("/register", controller.registerUser);
    }
}
const authRoutes = new auth();
authRoutes.routes();
exports.default = authRoutes.router;
