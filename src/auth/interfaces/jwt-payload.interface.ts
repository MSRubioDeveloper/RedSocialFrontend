export interface JwtPayload{
    // con el id sabremos quien es
    id: string;
    iat?: number;
    exp?: number;
}