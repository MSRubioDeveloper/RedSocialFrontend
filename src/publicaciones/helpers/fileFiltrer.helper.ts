export const fileFilter = (req: Express.Request, file: Express.Multer.File,
    callback: Function) =>{
    
        if( !file ) return callback( new Error("File is Empty"), false); //false, no aceptamos el archivo

        console.log(file.mimetype)

        const fileExtension = file.mimetype.split("/")[1];
        const validExtensions = ["jpeg", "jpg", "png", "gif", "pdf", "mp3", "wmv", "mpeg"];

        if( validExtensions.includes( fileExtension)){
            return callback(null, true)
        }


        

        callback(null, false)//true, si acepto el archivo
}