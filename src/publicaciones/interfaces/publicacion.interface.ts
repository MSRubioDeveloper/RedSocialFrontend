import { Schema as SchemaMongoose} from "mongoose";
import { Comentario } from "./comentario.interface";
import { Likes } from "./likes.interface";

export interface Publicacion{

    _id: SchemaMongoose.Types.ObjectId; 
    user: SchemaMongoose.Types.ObjectId;

    text: string;

    comentarios: Comentario[];

    likes: Likes[];

    secureUrl: string;

    publication_date: string;
}