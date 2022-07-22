"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Role_1 = __importDefault(require("../models/Role"));
const Joi = require("@hapi/joi");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
class authController {
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validaciones
            const { error } = schemaLogin.validate(req.body);
            if (error)
                return res.status(400).json({ error: error.details[0].message });
            // USUARIO
            const user = yield User_1.default.findOne({ email: req.body.email }).populate('roles').exec();
            if (!user)
                return res.status(400).json({ error: "Usuario no encontrado" });
            // PASSWORD
            const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
            if (!validPassword)
                return res.status(400).json({ error: "contraseña no válida" });
            //JSON WEB TOKEN
            // create token
            const token = jsonwebtoken_1.default.sign({
                name: user.name,
                id: user._id,
                roles: user.roles
            }, process.env.TOKEN_SECRET);
            // RESPUESTA
            res.header("auth-token", token).json({
                error: null,
                data: { token },
                name: user.name,
                roles: user.roles[0].name,
                msg: 'Bienvenido',
            });
            console.log("user", user);
        });
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //validaciones de usuario
            const { error } = schemaRegister.validate(req.body);
            const { roles } = req.body;
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            // BUSCAR EMAIL EN BD
            const existeEmail = yield User_1.default.findOne({ email: req.body.email });
            // RESPUESTA
            if (existeEmail)
                return res
                    .status(400)
                    .json({ error: true, mensaje: "email ya registrado" });
            // Hash Password
            const saltos = yield bcrypt_1.default.genSalt(10);
            const password = yield bcrypt_1.default.hash(req.body.password, saltos);
            // Crear Usuario
            const user = new User_1.default({
                name: req.body.name,
                email: req.body.email,
                password: password,
            });
            //Asignación de Roles
            if (roles) {
                const existeRole = yield Role_1.default.find({ name: { $in: roles } });
                user.roles = existeRole.map(role => role._id);
            }
            else {
                const role = yield Role_1.default.findOne({ name: 'user' });
                user.roles = [role._id];
            }
            // Guardar Usuario
            try {
                const savedUser = yield user.save();
                res.json({
                    error: null,
                    data: savedUser,
                });
            }
            catch (error) {
                res.status(400).json({ error });
            }
        });
    }
}
exports.authController = authController;
