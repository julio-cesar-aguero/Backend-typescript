import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import { type } from "os";
class img {
    @prop({ type: () => String })
    name!: string
}
export class Producto {

    @prop({ type: String, required: true, trim: true})
    name: string

    @prop({ type: String, required: true })
    description: string

    @prop({ type: Number, default: 0 })
    precio: number

    @prop({ type: Number, default: 0 })
    preciodeventa: number

    @prop({ type: String, required: true })
    folderfile: string


    @prop({ type: () => [String] })
    public imgProducto?: string[]; // This is a Primitive Array

    @prop({ type: Number })
    utilidad: number

}
const ProductoModel = getModelForClass(Producto)
export default ProductoModel