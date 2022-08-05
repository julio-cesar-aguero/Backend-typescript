import { Request, Response, Router } from "express"
import User from '../models/User'
import Role from '../models/Role'
import Venta from '../models/Venta'
import Joi = require('@hapi/joi');
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const path = require('path');
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
const html = '../templates/nueva-venta.html'

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
      const emailVentas = 'becarioweb@rodaccesorios.com'
      const dirFolder = path.join('../src/views/email.ejs');
      //mandar e-mail
      const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "92b08c96ee6f55",
          pass: "739a05dac15e90"
        },
        logger: true
      })
      const ejs = require("ejs");
      console.log("michi", dirFolder)
      ejs.renderFile("/home/julio/Escritorio/practica-final/Backend-typescript/src/views/email.ejs",{detalles: detalles}, function (err: any, data: any) {
        if (err) {
          console.log(err);
        } else {
          var mainOptions = {
            from: '"Sender Name" <from@example.net>',
            to: emailVentas,
            subject: "Hello from node",
            text: "Nueva Venta",
            html: data
          };

          transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
              res.json({
                msg: 'fail'
              })
            } else {
              res.json({
                msg: 'success'
              })
            }
          })
        }
      });




      console.log("Message sent: %s", html);


      return res.json({ msg: 'Ventas', data: ventaRes, details: emailVentas })
    } catch (error) {
      console.log(error)
    }
  }
}