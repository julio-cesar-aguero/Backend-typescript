import { prop, getModelForClass } from '@typegoose/typegoose'



export class Role {
    @prop({ type: () => String })
    name!: string
}
const UserRoles = getModelForClass(Role);
export default UserRoles