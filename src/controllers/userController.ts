import { Request, Response, Router } from "express"
import User from '../models/User'
import Role from '../models/Role'
//import Venta from '../models/Venta'
import Joi = require('@hapi/joi');
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const path = require('path');



export class userController {

    async nuevaVenta(req: Request, res: Response) {
        const detalles = req.body[0]
        const productos = req.body[1]
        console.log(productos)
        try {
            //const venta = new Venta({ detalles: detalles, productos: productos });
            //const savedVenta = await venta.save();
            return res.json({ msg: 'Ventas', data: productos})
        } catch (error) {
            console.log(error)
        }
    }
}