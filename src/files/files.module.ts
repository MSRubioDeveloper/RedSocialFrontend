import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ ]
})
export class FilesModule {}
