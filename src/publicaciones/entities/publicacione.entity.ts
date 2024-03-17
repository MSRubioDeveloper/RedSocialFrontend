import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as SchemaMongoose} from "mongoose";

import { Comentario } from "../interfaces/comentario.interface";
import { Likes } from "../interfaces/likes.interface";


@Schema()
export class Publicacion {

    //Mongo ID
    _id?: string;

    @Prop({ 
        type: SchemaMongoose.Types.ObjectId,
        ref: "User",
        required: true,
    })
    user: SchemaMongoose.Types.ObjectId; 



    @Prop({ required: true })
    text: string;
    

    @Prop({ required: true})
    secureUrl: string;

    @Prop( { required: true })
    publication_date: string;
}



export const PublicacionSchema = SchemaFactory.createForClass( Publicacion )