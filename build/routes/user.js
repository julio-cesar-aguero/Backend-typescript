"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validate_token_1 = require("../middleware/validate-token");
const controller = new userController_1.userController();
const validatetoken = new validate_token_1.validateToken();
class user {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.post("/nueva-venta", controller.nuevaVenta);
        this.router.get("/", controller.leerVentas);
    }
}
const userRoutes = new user();
userRoutes.routes();
exports.default = userRoutes.router;
