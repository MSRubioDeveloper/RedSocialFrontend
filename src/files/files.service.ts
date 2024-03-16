import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

import { v4 as uuidV4 } from "uuid";


@Injectable()
export class FilesService {
  async create(file: any) {
    try {
      const uuid = uuidV4();
      const fileExtension = file.mimetype.split("/")[1];

      const fileName = `${ uuid }.` + fileExtension;     

      const filePath = path.join(__dirname, '..', "..", 'static', 'products', fileName);
      fs.writeFileSync(filePath, file.buffer); // Guardar la imagen en el directorio


      
      return { message: 'Imagen guardada correctamente', filePath };
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
      throw error;
    }
  }
}
