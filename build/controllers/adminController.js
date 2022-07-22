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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { v4: uuidv4 } = require('uuid');
class adminController {
    orderVentas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                message: 'order Ventas'
            });
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
                        if (extension !== 'png' && extension !== 'jpeg' && extension !== 'jpg') {
                            console.log(file.mimetype, "extension", extension);
                            throw new Error('solo imagenes ( jpeg, jpg / png )');
                        }
                        if (file.size > 50 * 1024 * 1024) {
                            throw new Error('menos de 5M porfavor');
                        }
                        //creacion de espacio para imagenes
                        let fileFolder = uuidv4();
                        fileFolder = fileFolder.substr(-7);
                        const dirFolder = path_1.default.join(__dirname, '../public/img/productos/' + fields.name + fileFolder);
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
                        const dirFile = path_1.default.join(__dirname, `../public/img/productos/${fields.name}${fileFolder}/${fileName}${fileFolder}.${extension}`);
                        fs_1.default.renameSync(file.filepath, dirFile);
                        // guardado de referencia de imagen en BD
                        const producto = new Producto_1.default({ name: fields.name, description: fields.description, precio: fields.precio, preciodeventa: fields.preciodeventa, folderfile: fileFolder, imgProducto: `${fields.name}${fileFolder}.${extension}`, utilidad: fields.preciodeventa - fields.precio });
                        yield producto.save();
                        const productoRes = yield Producto_1.default.find();
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
                        const dirFolder = path_1.default.join(__dirname, '../public/img/productos/' + fields.name + fileFolder);
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
                            if (extension !== 'png' && extension !== 'jpeg' && extension !== 'jpg') {
                                console.log(file.mimetype, "extension", extension);
                                throw new Error('solo imagenes ( jpeg, jpg / png )');
                            }
                            if (file.size > 50 * 1024 * 1024) {
                                throw new Error('menos de 5M porfavor');
                            }
                            // guardado de imagen en servidor
                            let fileName = uuidv4();
                            fileName = fileName.substr(-3);
                            const dirFile = path_1.default.join(__dirname, `../public/img/productos/${fields.name}${fileFolder}/${fileName}${fields.name}${i}${fileFolder}.${extension}`);
                            imagesOfProduct.push(fileName + fields.name + i + fileFolder + '.' + extension);
                            try {
                                fs_1.default.renameSync(file.filepath, dirFile);
                            }
                            catch (error) {
                                fs_1.default.rmSync(dirFolder, { recursive: true });
                            }
                        }
                        // guardado de referencia de imagen en BD
                        const producto = new Producto_1.default({ name: fields.name, description: fields.description, precio: fields.precio, preciodeventa: fields.preciodeventa, folderfile: fields.name + fileFolder, imgProducto: imagesOfProduct, utilidad: fields.preciodeventa - fields.precio });
                        yield producto.save();
                        const productoRes = yield Producto_1.default.find();
                        res.json({ error: null, message: 'Producto agregado', data: productoRes, imagenes: imagesOfProduct });
                    }
                    catch (error) {
                        res.json({
                            error: error.message
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
                });
                res.status(200).json({ error: null, id, data });
            }
            catch (error) {
                return res.json({ msg: error });
            }
        });
    }
}
exports.adminController = adminController;
