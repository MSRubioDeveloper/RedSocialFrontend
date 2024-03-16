


import { v4 as uuidV4 } from "uuid";




export const fileNamer = (req: Express.Request, file: Express.Multer.File,
    callback: Function) =>{
    
        if( !file ) return callback( new Error("File is Empty"), false); //false, no aceptamos el archivo

        const uuid = uuidV4();
        const fileExtension = file.mimetype.split("/")[1];
        const fileName = `${ uuid }.` + fileExtension;     

        callback(null, fileName)//true, si acepto ela rchivo
}