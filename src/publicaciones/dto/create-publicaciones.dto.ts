import { IsString} from "class-validator";


export class CreatePublicacionesDto {

    //User info
    @IsString()
    userId: string

    //PublicacionInfo
    @IsString()
    text: string;


    
}


