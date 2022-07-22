import { Request, Response, Router } from "express"
import Producto from "../models/Producto";
import formidable, { File } from 'formidable'
import Joi = require('@hapi/joi');
import fs from 'fs';
import Venta from "../models/Venta";
import path from 'path';
const { v4: uuidv4 } = require('uuid');



export class adminController {


    async orderVentas(req: Request, res: Response) {
        res.status(200).json({
            message: 'order Ventas'
        })
    }
    async leerProductos(req: Request, res: Response) {

        try {
            const productos = await Producto.find({}).lean();
            return res.json(productos)

        } catch (error) {
            res.status(500).json({
                error
            })
        }

    }
    async agregarProducto(req: Request, res: Response) {

        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (!(<any>files.imgProducto).length) {

                try {
                    //Buscar Producto

                    const buscarProducto = await Producto.findOne({ name: fields.name })
                    if (buscarProducto) {
                        throw new Error('Nombre de producto ya registrado')
                    }

                    //validacion de imagenes

                    const file = files.imgProducto
                    const extension = ((<any>file).mimetype.split("/")[1]).trim()

                    if (err) {
                        throw new Error('falló la subida de imagen')
                    }
                    if (((<any>file).originalFilename) === '') {
                        throw new Error('ingresa una imagen')
                    }
                    if (extension !== 'png' && extension !== 'jpeg' && extension !== 'jpg') {
                        console.log((<any>file).mimetype, "extension", extension)
                        throw new Error('solo imagenes ( jpeg, jpg / png )')
                    }
                    if ((<any>file).size > 50 * 1024 * 1024) {
                        throw new Error('menos de 5M porfavor')
                    }

                    //creacion de espacio para imagenes

                    let fileFolder = uuidv4();
                    fileFolder = fileFolder.substr(-7);
                    const dirFolder = path.join(__dirname, '../public/img/productos/' + fields.name + fileFolder);
                    const imagesOfProduct = [];
                    fs.mkdir(dirFolder, (err) => {
                        if (err) {
                            throw new Error('falló la creación del directorio')
                        }
                        console.log('Directory created successfully!');
                    })

                    // guardado de imagen en servidor

                    let fileName = uuidv4();
                    fileName = fileName.substr(-7);
                    const dirFile = path.join(__dirname, `../public/img/productos/${fields.name}${fileFolder}/${fileName}${fileFolder}.${extension}`);
                    fs.renameSync((<any>file).filepath, dirFile)

                    // guardado de referencia de imagen en BD


                    const producto = new Producto({ name: fields.name, description: fields.description, precio: fields.precio, preciodeventa: fields.preciodeventa, folderfile: fileFolder, imgProducto: `${fields.name}${fileFolder}.${extension}`, utilidad: (<any>fields).preciodeventa - (<any>fields).precio })
                    await producto.save();
                    const productoRes = await Producto.find();
                    res.status(200).json({ error: null, message: 'Producto agregado', data: productoRes })



                } catch (error) {
                    res.json({
                        error: (<any>error).message
                    })

                }

            } else { // muttiples imagenes
                try {
                    //Buscar Producto

                    const buscarProducto = await Producto.findOne({ name: fields.name })
                    if (buscarProducto) {
                        throw new Error('Nombre de producto ya registrado')
                    }
                    if (err) {
                        throw new Error('falló la subida de imagenes')
                    }
                    //creacion de espacio para imagenes

                    let fileFolder = uuidv4();
                    fileFolder = fileFolder.substr(-7);
                    const dirFolder = path.join(__dirname, '../public/img/productos/' + fields.name + fileFolder);
                    const imagesOfProduct = [];
                    fs.mkdir(dirFolder, (err) => {
                        if (err) {
                            throw new Error('falló la creación del directorio')
                        }
                    })

                    for (let i = 0; i < (<any>files).imgProducto.length; i++) {

                        //validacion de imagenes

                        const file = (<any>files).imgProducto[i]
                        const extension = ((<any>file).mimetype.split("/")[1]).trim()

                        if (err) {
                            throw new Error('falló la subida de imagen')
                        }
                        if (((<any>file).originalFilename) === '') {
                            throw new Error('ingresa una imagen')
                        }
                        if (extension !== 'png' && extension !== 'jpeg' && extension !== 'jpg') {
                            console.log((<any>file).mimetype, "extension", extension)
                            throw new Error('solo imagenes ( jpeg, jpg / png )')
                        }
                        if ((<any>file).size > 50 * 1024 * 1024) {
                            throw new Error('menos de 5M porfavor')
                        }

                        // guardado de imagen en servidor

                        let fileName = uuidv4();
                        fileName = fileName.substr(-3);
                        const dirFile = path.join(__dirname, `../public/img/productos/${fields.name}${fileFolder}/${fileName}${fields.name}${i}${fileFolder}.${extension}`);
                        imagesOfProduct.push(fileName + fields.name + i + fileFolder + '.' + extension)
                        try {
                            fs.renameSync((<any>file).filepath, dirFile)
                        } catch (error) {
                            fs.rmSync(dirFolder, { recursive: true });
                        }
                    }

                    // guardado de referencia de imagen en BD

                    const producto = new Producto({ name: fields.name, description: fields.description, precio: fields.precio, preciodeventa: fields.preciodeventa, folderfile: fields.name + fileFolder, imgProducto: imagesOfProduct, utilidad: (<any>fields).preciodeventa - (<any>fields).precio })
                    await producto.save();
                    const productoRes = await Producto.find();
                    res.json({ error: null, message: 'Producto agregado', data: productoRes, imagenes: imagesOfProduct })

                } catch (error) {
                    res.json({
                        error: (<any>error).message
                    })

                }

            }
        })
    }

    async eliminarProducto(req: Request, res: Response) {
        console.log("eliminar")
        const { id } = req.params;
        console.log(id);
        try {
            const producto = await Producto.findById(id)
            await producto.remove()
            return res.status(200).json({ mensaje: 'Producto eliminado' })
        } catch (error) {
            return res.json({ msg: (<any>error).message })
        }
    }
    async editarProducto(req: Request, res: Response) {
        console.log("editar")
        const { id } = req.params;
        const data = req.body;
        try {
            Producto.updateOne({
                _id: id
            })
            res.status(200).json(
                { error: null, id, data }
            )
        } catch (error) {
            return res.json({ msg: error })
        }
    }

}

