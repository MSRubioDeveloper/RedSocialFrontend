import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidV4 } from "uuid";
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './entities/publicacione.entity';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { extname, join } from 'path';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class PublicacionesService {

  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
    private readonly configService: ConfigService
  ){}

   async createFile(file: any, body: CreatePublicacionesDto) {

    const { email, name, text, imgPerfil, isActive, roles, publication_date }  = body;


    try {
      const uuid = uuidV4();
      const fileExtension = file.mimetype.split("/")[1];

      const fileName = `${ uuid }.` + fileExtension;     

      const filePath = path.join(__dirname, '..', "..", 'static', 'products', fileName);
      fs.writeFileSync(filePath, file.buffer); // Guardar la imagen en el directorio


      //encontrar al usuario
      const user = await this.UserModel.findOne( {email} );



      const publicacion = new this.publicacionModel({
        email,
        name,
        text,
        imgPerfil,
        likes: [],
        isActive,
        roles,
        secureUrl: `${ this.configService.get("HOST_API") }/${ uuid }.${ fileExtension}`,
        publication_date

      });
      
      const savePost = await this.publicacionModel.create( publicacion )

      return savePost;
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
      throw error;
    }
  }


  async getPublicationById(_id: string){
    try{
      const mongoId = new mongoose.Types.ObjectId(_id)
      const publication = await this.publicacionModel.findOne({ _id: mongoId })

      return publication
    }catch( error ){
      return {
        error: `Mongo Id inexistente: ${_id }, asegurate que sea un UUID valido y en formato string`
      }
    }

  }


  async getAllPub(){
    return await this.publicacionModel.find();
  }

  public getStaticProductImage( imageNameFull: string  ){

    const path = join(__dirname, "../../static/products", imageNameFull);
   

    if( !fs.existsSync(path) ){
      throw new BadRequestException("No product found with image name")
    }

    return path;
  }

}
