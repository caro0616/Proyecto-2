import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** US-09: registro con email + contraseña */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** US-09: login con email + contraseña */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * US-09: login con Google.
   * El cliente envía el Google ID Token en el header Authorization.
   * En producción se valida con google-auth-library; aquí se acepta
   * el perfil JSON en el body para permitir pruebas sin OAuth configurado.
   */
  @Post('google')
  async googleLogin(
    @Body()
    profile: {
      googleId: string;
      email: string;
      name: string;
    },
  ) {
    return this.authService.loginWithGoogle(profile);
  }

  /** Verificar token y obtener payload */
  @Get('me')
  async me(@Headers('authorization') authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token requerido');
    }
    const token = authHeader.slice(7);
    return this.authService.verifyToken(token);
  }
}
