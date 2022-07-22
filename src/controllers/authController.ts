import { Request, Response, Router } from "express"
import User from '../models/User'
import Role from '../models/Role'
import Joi = require('@hapi/joi');
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//const user = ModelUser.loginUser();
const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

const schemaRegister = Joi.object({
  name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required(),
  password: Joi.string().min(6).max(255).required(),
  roles: Joi.array(),
});

export class authController {


  async loginUser(req: Request, res: Response) {
    // Validaciones
    const { error } = schemaLogin.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });
    // USUARIO
    const user = await User.findOne({ email: req.body.email }).populate('roles').exec();

    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

    // PASSWORD
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword)
      return res.status(400).json({ error: "contraseña no válida" });

    //JSON WEB TOKEN
    // create token
    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
        roles: user.roles
      }, process.env.TOKEN_SECRET
    );

    // RESPUESTA

    res.header("auth-token", token).json({
      error: null,
      data: { token },
      name: user.name,
      roles: user.roles[0].name,
      msg: 'Bienvenido',
    });

    console.log("user", user)


  }
  async registerUser(req: Request, res: Response) {
    //validaciones de usuario

    const { error } = schemaRegister.validate(req.body);
    const { roles } = req.body;


    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }


    // BUSCAR EMAIL EN BD
    const existeEmail = await User.findOne({ email: req.body.email });

    // RESPUESTA
    if (existeEmail)
      return res
        .status(400)
        .json({ error: true, mensaje: "email ya registrado" });

    // Hash Password

    const saltos = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, saltos);

    // Crear Usuario

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: password,
    });

    //Asignación de Roles

    if (roles) {
      const existeRole = await Role.find({ name: { $in: roles } });
      user.roles = existeRole.map(role => role._id)

    } else {
      const role = await Role.findOne({ name: 'user' });
      user.roles = [role._id]
    }

    // Guardar Usuario

    try {
      const savedUser = await user.save();
      res.json({
        error: null,
        data: savedUser,
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}

