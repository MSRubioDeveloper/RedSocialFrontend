import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidV4 } from "uuid";
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './entities/publicacione.entity';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

import {  join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Like } from './entities/likes.entity';
import { PubLikesDto } from './dto/pubLikesDto.dto';



@Injectable()
export class PublicacionesService {

  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
    @InjectModel(Like.name) private likeModel: Model<Like>,

    private readonly configService: ConfigService
  ){}

   async createFile(file: any, body: CreatePublicacionesDto) {

    const { userId, text }  = body;

    const publication_date = new Date();

    try {
      const uuid = uuidV4();
      const fileExtension = file.mimetype.split("/")[1];

      const fileName = `${ uuid }.` + fileExtension;     

      const filePath = path.join(__dirname, '..', "..", 'static', 'products', fileName);
      fs.writeFileSync(filePath, file.buffer); // Guardar la imagen en el directorio


      //encontrar al usuario
      const user = await this.UserModel.findOne( { _id: userId } );
      if( !user ) throw new BadRequestException("Usuario");

      console.log( new Date())
      const publicacion = new this.publicacionModel({
        user: user._id,
        text,
        likes: [],
        secureUrl: `${ this.configService.get("HOST_API") }/${ uuid }.${ fileExtension}`,
        publication_date

      });
      
      // Save new post
      const savePost = await this.publicacionModel.create( publicacion )

      return await this.getAllPub();

  
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
      throw error;
    }
  }


  async getPublicationById(_id: string): Promise<Publicacion>{
    try{
      const mongoId = new mongoose.Types.ObjectId(_id)
      const publication = await this.publicacionModel.findOne({ _id: mongoId })

      return publication
    }catch( error ){
      
      throw new BadRequestException(`Mongo Id inexistente: ${_id }, asegurate que sea un UUID valido y en formato string`)
    }

  }


  async getAllPub(){
    const publicaciones =  await this.publicacionModel.find()
        // .skip( page - 1 )

    const filtredPub = await Promise.all( publicaciones.map(async (publicaciones) =>{
      
      const user = await this.UserModel.findById( publicaciones.user);
      return {
        publicacion: publicaciones,
        user: {
          profileImage: user.imgPerfil,
          name: user.name
        }
    };
    }) )

    return filtredPub;

  }

  public getStaticProductImage( imageNameFull: string  ){

    const path = join(__dirname, "../../static/products", imageNameFull);
   

    if( !fs.existsSync(path) ){
      throw new BadRequestException("No product found with image name")
    }

    return path;
  }



  public async like( idPub: string, idUser: string): Promise<boolean>{
    
    const publicacion = await this.getPublicationById( idPub );
 
    //validar si la coleccion de 
    //likes ya tiene un like asociado a la publicacion con este user
    const thereIsALike = await this.likeModel.findOne({
      userId: idUser,
      publicacionId: publicacion._id
    });

    if( !thereIsALike ){
      const like  = await this.likeModel.create({
        userId: idUser,
        publicacionId: publicacion._id,
        liked: true
      });
      return like.liked;
    } else {
      // Cambiar el estado del "like"
       thereIsALike.liked = !thereIsALike.liked;
      const like = await thereIsALike.save();
      return like.liked;
    }

  }


  public async searchPubLikes(pubAndUseId: PubLikesDto){

    const arrayPublicacionesId = JSON.parse( pubAndUseId.idPublicaciones );

    const publicacionesLikes = await this.likeModel.find({
      userId: pubAndUseId.idUser,
      publicacionId: { $in: arrayPublicacionesId},
      liked: true
    })

    return publicacionesLikes.map( pub => {
      return { idPub: pub.publicacionId, liked: pub.liked}
    })
  }
}
