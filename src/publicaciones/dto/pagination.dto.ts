import { IsNumber } from "class-validator";


export class PaginationDto {

    //User info
    @IsNumber()
    page: number

    //PublicacionInfo
    @IsNumber()
    limit: number;

    
}


