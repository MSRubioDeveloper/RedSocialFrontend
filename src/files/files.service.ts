import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }
}
