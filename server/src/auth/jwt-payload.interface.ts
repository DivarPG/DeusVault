export interface JwtPayload {
  sub: string; // userId
  username: string; // имя пользователя
  iat?: number; // время выпуска токена (опционально)
  exp?: number; // время истечения (опционально)
}
