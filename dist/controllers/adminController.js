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
exports.adminController = void 0;
const Producto_1 = __importDefault(require("../models/Producto"));
const formidable_1 = __importDefault(require("formidable"));
const Joi = require("@hapi/joi");
const fs_1 = __importDefault(require("fs"));
const Venta_1 = __importDefault(require("../models/Venta"));
const path_1 = __importDefault(require("path"));
const { v4: uuidv4 } = require('uuid');
const schemaProducto = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    description: Joi.string().min(6).max(1024).required(),
    precio: Joi.number(),
    preciodeventa: Joi.number(),
    imgProducto: Joi.allow,
});
class adminController {
    orderVentas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            Venta_1.default.aggregate([
                // Unwind to "de-normalize"
                { "$unwind": "$productos" },
                // Group as expected
                {
                    "$group": {
                        "_id": "$productos.id",
                        "total": { "$sum": "$productos.cantidad" },
                    }
                }
            ], function (err, result) {
                // process results here
                return res.json(result);
            });
            const producto = yield Venta_1.default.findOne({ total: '4' });
            console.log(producto);
            /*
            try {
              const ventas = await Venta.find({}).lean();
              return res.json(ventas)
          
            } catch (error) {
              res.status(500).json({
                error: error.message
              })
            }*/
        });
    }
    leerProductos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productos = yield Producto_1.default.find({}).lean();
                return res.json(productos);
            }
            catch (error) {
                res.status(500).json({
                    error
                });
            }
        });
    }
    agregarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = (0, formidable_1.default)({ multiples: true });
            form.parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
                if (!files.imgProducto.length) {
                    try {
                        //validar campos
                        const { error } = schemaProducto.validate(fields);
                        if (error)
                            return res.status(400).json({ error: error.details[0].message });
                        //Buscar Producto
                        const buscarProducto = yield Producto_1.default.findOne({ name: fields.name });
                        if (buscarProducto) {
                            throw new Error('Nombre de producto ya registrado');
                        }
                        //validacion de imagenes
                        const file = files.imgProducto;
                        const extension = (file.mimetype.split("/")[1]).trim();
                        if (err) {
                            throw new Error('falló la subida de imagen');
                        }
                        if ((file.originalFilename) === '') {
                            throw new Error('ingresa una imagen');
                        }
                        if (extension !== 'png' && extension !== 'jpeg' && extension !== 'jpg' && extension !== 'webp') {
                            console.log(file.mimetype, "extension", extension);
                            throw new Error('solo imagenes ( jpeg, jpg / png )');
                        }
                        if (file.size > 50 * 1024 * 1024) {
                            throw new Error('menos de 5M porfavor');
                        }
                        //creacion de espacio para imagenes
                        let fileFolder = uuidv4();
                        fileFolder = fileFolder.substr(-7);
                        const dirFolder = path_1.default.join(__dirname, '../images/productos/' + fileFolder);
                        const imagesOfProduct = [];
                        fs_1.default.mkdir(dirFolder, (err) => {
                            if (err) {
                                throw new Error('falló la creación del directorio');
                            }
                            console.log('Directory created successfully!');
                        });
                        // guardado de imagen en servidor
                        let fileName = uuidv4();
                        fileName = fileName.substr(-7);
                        const dirFile = path_1.default.join(__dirname, `../images/productos/${fileFolder}/${fileName}.${extension}`);
                        fs_1.default.renameSync(file.filepath, dirFile);
                        // guardado de referencia de imagen en BD
                        const producto = new Producto_1.default({ name: fields.name, description: fields.description, precio: fields.precio, preciodeventa: fields.preciodeventa, folderfile: fileFolder, imgProducto: `${fileName}.${extension}`, utilidad: fields.preciodeventa - fields.precio });
                        yield producto.save();
                        const productoRes = yield Producto_1.default.find(producto);
                        res.status(200).json({ error: null, message: 'Producto agregado', data: productoRes });
                    }
                    catch (error) {
                        res.json({
                            error: error.message
                        });
                    }
                }
                else { // muttiples imagenes
                    try {
                        const { error } = schemaProducto.validate(fields);
                        if (error)
                            return res.status(400).json({ error: error.details[0].message });
                        //Buscar Producto
                        const buscarProducto = yield Producto_1.default.findOne({ name: fields.name });
                        if (buscarProducto) {
                            throw new Error('Nombre de producto ya registrado');
                        }
                        if (err) {
                            throw new Error('falló la subida de imagenes');
                        }
                        //creacion de espacio para imagenes
                        let fileFolder = uuidv4();
                        fileFolder = fileFolder.substr(-7);
                        const dirFolder = path_1.default.join(__dirname, '../images/productos/' + fileFolder);
                        const imagesOfProduct = [];
                        fs_1.default.mkdir(dirFolder, (err) => {
                            if (err) {
                                throw new Error('falló la creación del directorio');
                            }
                        });
                        for (let i = 0; i < files.imgProducto.length; i++) {
                            //validacion de imagenes
                            const file = files.imgProducto[i];
                            const extension = (file.mimetype.split("/")[1]).trim();
                            if (err) {
                                throw new Error('falló la subida de imagen');
                            }
                            if ((file.originalFilename) === '') {
                                throw new Error('ingresa una imagen');
                            }
                            if (extension !== 'png' && extension !== 'jpeg' && extension !== 'jpg' && extension !== 'webp') {
                                console.log(file.mimetype, "extension", extension);
                                throw new Error('solo imagenes ( jpeg, jpg / png )');
                            }
                            if (file.size > 50 * 1024 * 1024) {
                                throw new Error('menos de 5M porfavor');
                            }
                            // guardado de imagen en servidor
                            let fileName = uuidv4();
                            fileName = fileName.substr(-3);
                            const dirFile = path_1.default.join(__dirname, `../images/productos/${fileFolder}/${fileName}${i}${fileFolder}.${extension}`);
                            imagesOfProduct.push(fileName + i + '.' + extension);
                            try {
                                fs_1.default.renameSync(file.filepath, dirFile);
                            }
                            catch (error) {
                                res.json({ error: error });
                                fs_1.default.rmSync(dirFolder, { recursive: true });
                            }
                        }
                        // guardado de referencia de imagen en BD
                        const producto = new Producto_1.default({ name: fields.name, description: fields.description, precio: fields.precio, preciodeventa: fields.preciodeventa, folderfile: fileFolder, imgProducto: imagesOfProduct, utilidad: fields.preciodeventa - fields.precio });
                        yield producto.save();
                        const productoRes = yield Producto_1.default.find(producto);
                        res.json({ error: null, message: 'Producto agregado', data: productoRes, imagenes: imagesOfProduct });
                    }
                    catch (error) {
                        res.json({
                            error: error
                        });
                    }
                }
            }));
        });
    }
    eliminarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("eliminar");
            const { id } = req.params;
            console.log(id);
            try {
                const producto = yield Producto_1.default.findById(id);
                yield producto.remove();
                return res.status(200).json({ mensaje: 'Producto eliminado' });
            }
            catch (error) {
                return res.json({ msg: error.message });
            }
        });
    }
    editarProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("editar");
            const { id } = req.params;
            const data = req.body;
            try {
                Producto_1.default.updateOne({
                    _id: id
                }, data, (err, updatedProducto) => {
                    if (err)
                        throw err;
                    console.log("Actualizado", data);
                    res.json({ error: null, id, data });
                });
            }
            catch (error) {
                return res.json({ msg: error });
            }
        });
    }
}
exports.adminController = adminController;
