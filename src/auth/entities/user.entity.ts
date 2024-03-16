import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Amigo } from "../types/amigo.types";

@Schema()
export class User {

    _id?: string;

    @Prop({ unique: true, required: true})
    email: string;

    @Prop({ required: true})
    password?: string;

    @Prop({  required: true})
    name: string;

    @Prop({ default: false})
    isActive: boolean;

    @Prop({type: [String], default: ["user"] })
    roles: string[]
 
    @Prop({ default: ""})
    imgPerfil?: string;

    @Prop( {type:[Amigo] ,default: []})
    amigos: Amigo[];



}



export const UserSchema = SchemaFactory.createForClass( User )