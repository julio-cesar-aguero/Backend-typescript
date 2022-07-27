
import {prop, getModelForClass, Ref} from '@typegoose/typegoose'
import {Role} from './Role'
import {Producto} from './Producto'


class Detalles{
    @prop({ type: () => Number })
    Total!: number
    @prop({ type: () => Number })
    articulosTotal!: number
    @prop({ type: () => Number })
    cambio: number
    @prop({ type: () => Number })
    importe: number
    @prop({ type: () => String })
    username: string
    @prop({ type: () => Date, default: Date.now })
    fechaVenta: string
}
class Productos{

    @prop({ type: () => String })
    name: string;

    @prop({ type: () => String })
    precio: string;

    @prop({ type: () => String })
    preciodeventa: string;

    @prop({ type: () => Number })
    cantidad: number;

    @prop({ type: () => Number })
    utilidad: number;

}

export class Venta{
    @prop({type: () => [Detalles], _id: false})
    detalles: Detalles[];

    @prop({type: () => Productos, _id: false})
    productos: Productos[];
}


const ventaModel = getModelForClass(Venta);
export default ventaModel