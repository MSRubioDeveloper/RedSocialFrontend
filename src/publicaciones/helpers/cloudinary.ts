import { InternalServerErrorException } from "@nestjs/common";
import {  v2 as cloudinary } from "cloudinary";
import { CloudResponse } from "../interfaces/CloudImageResponse.interface";


cloudinary.config({
    cloud_name: "dl0rfcl1l",
    api_key: "227812379146857",
    api_secret: "SyyJb7jKKTD7bliFmbmO6Wg4c9w",
    secure: true

}) 

export class CloudinaryService {

    static async sendImage( imgBuffer: any, folder: string){
      return await new Promise((resolve) => {
        cloudinary.uploader.upload_stream( {folder}, (error, uploadResult)  => {
          if( error ) throw new InternalServerErrorException("Error Cloud" + error)
            resolve(uploadResult);
        }).end(imgBuffer);
    });
    }

    static async destroy( imgId: string){
      try{
        return await cloudinary.uploader.destroy(imgId, { invalidate: true},
          (result )=>{
            return {
              message: "Imagen guardada exitosamente",
              result
            }
          })
      }catch( err ){
        throw new InternalServerErrorException("Error al eliminar recurso, verifica img_id");
      }
    }


  
  }
