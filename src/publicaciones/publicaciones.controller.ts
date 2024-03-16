import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res } from '@nestjs/common';


import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionesDto } from './dto/create-publicaciones.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/auth/guards/auth.guard';
// import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards( AuthGuard )
@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly filesService: PublicacionesService,
    private readonly condifService: ConfigService
    
    ) {}

  // @UseGuards( AuthGuard)
  @Post("/add") 
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
  }) )
  create(@UploadedFile()file: Express.Multer.File,
  @Body() body: CreatePublicacionesDto,

  ) {

    console.log(body)
    return this.filesService.createFile(file, body);

    
  }


  @Get("/getById")
  getPublication(@Body() id: string){
    return this.filesService.getPublicationById( id )
  }

  @Get("/getAll")
  getAllPublciations(){
    return this.filesService.getAllPub( )
  }

  @Get("/:imageName")
  getImageById(@Param("imageName") imageName: string,  @Res() res: Response ){
         //image a devolver 
         const path = this.filesService.getStaticProductImage( imageName );

         res.sendFile( path )
  }

}
