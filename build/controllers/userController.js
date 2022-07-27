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
exports.userController = void 0;
const Venta_1 = __importDefault(require("../models/Venta"));
const path = require('path');
class userController {
    leerVentas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ventas = yield Venta_1.default.find({}).lean();
                return res.json(ventas);
            }
            catch (error) {
                res.status(500).json({
                    error
                });
            }
        });
    }
    nuevaVenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const detalles = req.body[0];
            const productos = req.body[1];
            try {
                const venta = new Venta_1.default({ detalles: detalles, productos: productos });
                yield venta.save();
                const ventaRes = yield Venta_1.default.find(venta);
                return res.json({ msg: 'Ventas', data: ventaRes });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.userController = userController;
