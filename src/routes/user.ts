import { Request, Response, Router } from 'express'

import { userController } from '../controllers/userController'
import { validateToken } from '../middleware/validate-token';

const controller = new userController();

const validatetoken = new validateToken();

class user {
    router: Router
    constructor() {
        this.router = Router();
        this.routes();
    }
    routes() {
        this.router.post("/nueva-venta", controller.nuevaVenta);
        
   }
}
const userRoutes = new user();
userRoutes.routes();
export default userRoutes.router