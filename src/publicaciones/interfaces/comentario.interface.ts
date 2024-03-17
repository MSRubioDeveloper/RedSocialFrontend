

export class Comentario{

    likes: number;
    comentario: string;
    autor: string;
    horaDePublicacion: Date;
    respuestas?: Comentario[]

}