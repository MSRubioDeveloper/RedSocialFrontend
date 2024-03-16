import { IsArray, IsBoolean, IsDate, IsEmail, IsNumber, IsString, IsUUID, MinLength, isString } from "class-validator";

export class CreatePublicacionesDto {

    //User info
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    //Publicacion

    @IsString()
    text: string;

    @IsString()
    isActive: boolean;

    @IsString()
    roles: string[];

    @IsString()
    imgPerfil: string;


    @IsString()
    publication_date: string;

    
}
