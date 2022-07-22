import {Request, Response, Router} from 'express'

import { authController } from '../controllers/authController'

const controller = new authController();

class auth{
    router: Router
    constructor(){
        this.router = Router();
        this.routes();
    }
    routes(){
        this.router.post("/login", controller.loginUser);
        this.router.post("/register", controller.registerUser);
    }
}
const authRoutes = new auth();
authRoutes.routes();
export default authRoutes.router