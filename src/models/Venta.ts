
import {prop, getModelForClass, Ref} from '@typegoose/typegoose'
import {Role} from './Role'

class detalles{
    @prop()
    Total: number
}
class productos{
    @prop()
    name: string
}
export class Venta{
    @prop({type: () => [detalles]})
    detalles: detalles[];

    @prop({type: () => {productos}})
    productos: productos[];
}


const ventaModel = getModelForClass(Venta);
export default ventaModel