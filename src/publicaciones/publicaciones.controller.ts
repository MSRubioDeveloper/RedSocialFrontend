import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFile, Res, BadRequestException, Req, Query } from '@nestjs/common';


import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { Request, Response, query } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PubLikesDto } from './dto/pubLikesDto.dto';
// import { AuthGuard } from 'src/auth/guards/auth.guard';


@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly filesService: PublicacionesService,
    private readonly condifService: ConfigService
    
    ) {}
  
  @UseGuards( AuthGuard )
  @Post("/add") 
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
  }) )
  create(@UploadedFile()file: Express.Multer.File,
  @Body() body: CreatePublicacionesDto,
  @Query("page") page: number = 1, 
    @Query("limit")  limit: number = 10
  ) {

    return this.filesService.createFile(file, body, page, limit);
  }

  @UseGuards( AuthGuard )
  @Get("/getById")
  getPublication(@Body() id: string){
    return this.filesService.getPublicationById( id )
  }

  @UseGuards( AuthGuard ) 
  @Get("/getAll")
  getAllPublciations(
    @Query("page") page: number = 1, 
    @Query("limit")  limit: number = 10
  ){
    return this.filesService.getAllPub( page, limit)
  }

  @Get("/:imageName")
  getImageById(@Param("imageName") imageName: string,  @Res() res: Response ){
         //image a devolver 
         const path = this.filesService.getStaticProductImage( imageName );

         res.sendFile( path )
  }

  @UseGuards()
  @Get("/like/:idPub/:idUser")
  addLike(@Param("idPub") idPub: string,
    @Param("idUser") idUser: string
  ){
    //Recibimos id de la publicacion

    const like = this.filesService.like( idPub, idUser )
      .then(like => like).catch( err => err)
    
    return like;

  }

  @UseGuards()
  @Post("/getAllLikes")
  getAllLikes( @Body() idPublicaciones: PubLikesDto,

  ){
    //Recibimos id de la publicacion
    return this.filesService.searchPubLikes( idPublicaciones)


  }

  @UseGuards()
  @Post("/likes/countPubLikes")
  getPublicationTotalLikes(
       @Query("pubID") pubID: string
  ){

    return this.filesService.pubLikesCount( pubID)
  }



}
