import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Comentario } from "../interfaces/comentario.interface";
import { Likes } from "../interfaces/likes.interface";

@Schema()
export class Publicacion {

    _id?: string;

    //User
    @Prop({  required: true})
    email: string;

    @Prop({  required: true})
    name: string
    
    @Prop({ default: true})
    isActive: boolean;

    @Prop({type: [String], default: ["user"] })
    roles: string[]

    @Prop({ default: ""})
    imgPerfil?: string;




    @Prop({ required: true })
    text: string;
    
    @Prop({ type: [Comentario], default: []})
    comentarios: Comentario[];


    @Prop( {type: [String], default: [] })
    likes: Likes[];


    @Prop({ required: true})
    secureUrl: string;

    @Prop( { required: true })
    publication_date: string;
}



export const PublicacionSchema = SchemaFactory.createForClass( Publicacion )