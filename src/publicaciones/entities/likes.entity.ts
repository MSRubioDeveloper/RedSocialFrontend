import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as SchemaMongoose} from "mongoose";
import { Publicacion } from "./publicacione.entity";




@Schema()
export class Like {

    //Mongo ID
    // _id?: string;

    @Prop({ 
        type: SchemaMongoose.Types.ObjectId,
        ref: "User",
        required: true,
    })
    userId: SchemaMongoose.Types.ObjectId; 

    @Prop({
        type: SchemaMongoose.Types.ObjectId,
        ref: Publicacion.name,
        required: true
    })
    publicacionId: SchemaMongoose.Types.ObjectId; 

    @Prop({ 
        type: Boolean,
        default: true
    })
    liked: boolean 


}



export const LikeSchema = SchemaFactory.createForClass( Like  )