import { Schema as SchemaMongoose} from "mongoose";

export interface Likes {
    _id: SchemaMongoose.Types.ObjectId; 

    userId: SchemaMongoose.Types.ObjectId; 

    likeId: SchemaMongoose.Types.ObjectId; 

}