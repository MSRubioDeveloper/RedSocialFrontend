import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FilesService } from './files.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
// import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @UseGuards( AuthGuard)
  @Post() 
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000},
    // storage: diskStorage({
    //   destination: "./static/products",
    //   filename: fileNamer,
      
    // })
  }) )
  create(@UploadedFile()file: Express.Multer.File) {
    
    console.log(file)
    this.filesService.create(file);

    
    return {
      "img": "isd",
      "TEST": "VENGO DEL BACKEND"
    }
    // return 
  }


 

}
