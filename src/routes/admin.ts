import { Request, Response, Router } from 'express'

import { adminController } from '../controllers/adminController'
import { validateToken } from '../middleware/validate-token';

const controller = new adminController();

const validatetoken = new validateToken();

class admin {
    router: Router
    constructor() {
        this.router = Router();
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
export default adminRoutes.router