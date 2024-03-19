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
import { CloudinaryService } from './helpers/cloudinary';



@Injectable()
export class PublicacionesService {

  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Publicacion.name) private publicacionModel: Model<Publicacion>,
    @InjectModel(Like.name) private likeModel: Model<Like>,

    private readonly configService: ConfigService
  ){}

  
async createFile(file: Express.Multer.File, body: CreatePublicacionesDto, page: number, limit: number) {

  const { userId, text }  = body;

  const publication_date = new Date();

  try {
    //encontrar al usuario
    const user = await this.UserModel.findOne( { _id: userId } );
    if( !user ) throw new BadRequestException("Usuario no registrado");
    //!TODO
      // subir image a cloudinary
    const uploadImage = await CloudinaryService.sendImage( file.buffer );

    console.log(uploadImage[".public_id"])

    console.log( uploadImage )
    const publicacion = new this.publicacionModel({
      user: user._id,
      text,
      likes: [],
      secureUrl: uploadImage["secure_url"],
      publication_date,
      imgPublic_id: uploadImage["public_id"]

    });
    
    // Save new post
    const savePost = await this.publicacionModel.create( publicacion )

    const allPubs = await this.getAllPub(page, limit);
    
    return allPubs

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


  async getAllPub(page: number, limit: number ){

    //VALIDACIONES QUERYS
    if( isNaN(page) || isNaN(limit) ) throw new BadRequestException("Page and Limit muts be number");
    if( page <= 0 ) throw new BadRequestException("Page must be greater than 0");
    if( limit <= 0 ) throw new BadRequestException("Limit must be greater than 0");

    const publicaciones =  await this.publicacionModel.find()
         .sort({ publication_date: -1 })
         .skip( (page - 1) * limit )
         .limit( limit )

    const filtredPub = await Promise.all( publicaciones.map(async (pub) =>{
      
      const user = await this.UserModel.findById( pub.user);
      return {
        publicacion: pub,
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


  //Encontrar todos los likes asociados a X publicacion
   public async pubLikesCount( PubsID: string){

    const arrayPublicacionesId = JSON.parse( PubsID );

    // const likes = await this.likeModel.find({
    //   publicacionId: pubID,
    //   liked: true

    // })

    //ADAPTAR 
    const ids = await Promise.all( arrayPublicacionesId.map(async (IDPUB) =>{
      
      const likes = await this.likeModel.find({
        publicacionId: IDPUB,
        liked: true
      });
      return {
        publicacionID: IDPUB,
        likes: likes.length
      };
      }))


      return ids;
  }
}
