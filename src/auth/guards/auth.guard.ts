import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( 
    private jwtService: JwtService,
    private authService: AuthService
    ){}

  //context = un opbj con toda la informacion de la peticion hecha
  async canActivate(context: ExecutionContext): Promise<boolean>{
    //True = puede entrar a la ruta, false, no se puede
    const request = context.switchToHttp().getRequest();
    //sacando el token mandado desde el frontend (en la peticion del usuario)
    const token = this.extractTokenFromHeader(request) 
    
    //si no se manda token, regresa un error
    if( !token ){
      throw new UnauthorizedException("No hay token en la peticion");
    }

    //se obtiene el payload, se verifica que el token recibido 
    //sea correcto basandose en la firma de nuestro backend
    //si el token no es valido, estara malformado y dara error
  try{
    const payload = await this.jwtService.verifyAsync<JwtPayload>(
      token, 
      {
        secret: process.env.JWT_SEED
      }
    )
      const user = await this.authService.findUserById( payload.id );
      if( !user){
        throw new UnauthorizedException("Este usuario no existe")
      }
      if( !user.isActive ) throw new UnauthorizedException("User is not active")

      //asignas en el objeto de la request el valor del payload
      //al ser un obj global puede ser accedido en otras partes de la app
      
      request["user"]= user;
      console.log({re: request["user"]})

      return true
  }catch(error){
    console.log(error)
    throw new UnauthorizedException("Usuario no activo o inexistente");
  }
  }


  private extractTokenFromHeader( request: Request): string | undefined{
    const [type, token] = request.headers["authorization"]?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined
  }
}
