"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const validate_token_1 = require("../middleware/validate-token");
const controller = new adminController_1.adminController();
const validatetoken = new validate_token_1.validateToken();
class admin {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.get("/", validatetoken.isAdmin, controller.leerProductos);
        this.router.post("/nuevo-producto", controller.agregarProducto);
        this.router.delete("/eliminar/:id", controller.eliminarProducto);
        this.router.put("/editar/:id", controller.editarProducto);
        this.router.get("/order", controller.orderVentas);
    }
}
const adminRoutes = new admin();
adminRoutes.routes();
exports.default = adminRoutes.router;
