/** Payload almacenado dentro del JWT */
export interface JwtPayload {
  sub: string; // userId (ObjectId)
  email: string;
  role: 'customer' | 'admin';
  provider: 'local' | 'google';
}
