
import {prop, getModelForClass, Ref} from '@typegoose/typegoose'
import {Role} from './Role'
export class User{
    @prop({ type: () => String })
    name: string
    @prop({ type: () => String })
    email: string
    @prop({ type: () => String })
    password: string
    @prop({ type: () => String })
    date: string
    @prop({ ref: () => Role })
  public roles!: Ref<Role, string>[];
    
}
const UserModel = getModelForClass(User);
export default UserModel