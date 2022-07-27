import { Request, Response, Router } from "express"
import User from '../models/User'
import Role from '../models/Role'
import Venta from '../models/Venta'
import Joi = require('@hapi/joi');
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const path = require('path');



export class userController {
    async leerVentas(req: Request, res: Response) {

        try {
            const ventas = await Venta.find({}).lean();
            return res.json(ventas)

        } catch (error) {
            res.status(500).json({
                error
            })
        }
    }

    async nuevaVenta(req: Request, res: Response) {
        const detalles = req.body[0]
        const productos = req.body[1]
        try {
            const venta = new Venta({ detalles: detalles, productos: productos });
            await venta.save();
            const ventaRes = await Venta.find(<any>venta);
            return res.json({ msg: 'Ventas', data: ventaRes})
        } catch (error) {
            console.log(error)
        }
    }
}