import { IsNumber, IsString} from "class-validator";


export class PubLikesDto {

    //id user
    @IsString()
    idUser: string

    //id Publicaciones
    @IsString()
    idPublicaciones: string
    
}

