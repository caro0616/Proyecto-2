import { Injectable, NgZone, inject } from '@angular/core';
import { environment } from '../../environments/environment';

/** Tipado mínimo de la API google.accounts.id */
declare const google: {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
        auto_select?: boolean;
      }) => void;
      prompt: () => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type?: string;
          theme?: string;
          size?: string;
          text?: string;
          width?: number;
          logo_alignment?: string;
        },
      ) => void;
    };
  };
};

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private zone = inject(NgZone);
  private _initialized = false;
  private _resolve: ((profile: GoogleProfile) => void) | null = null;
  private _reject: ((err: Error) => void) | null = null;

  get isConfigured(): boolean {
    return !!environment.googleClientId;
  }

  /** Carga el script de Google Identity Services si no está cargado */
  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google?.accounts?.id) {
        resolve();
        return;
      }
      const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar Google Sign-In'));
      document.head.appendChild(script);
    });
  }

  /** Inicializa GIS con el callback que resuelve el credential */
  private async initialize(): Promise<void> {
    if (this._initialized) return;
    await this.loadScript();

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential: string }) => {
        this.zone.run(() => {
          try {
            const profile = this.decodeCredential(response.credential);
            this._resolve?.(profile);
          } catch (err) {
            this._reject?.(err instanceof Error ? err : new Error(String(err)));
          } finally {
            this._resolve = null;
            this._reject = null;
          }
        });
      },
    });

    this._initialized = true;
  }

  /**
   * Renderiza el botón oficial de Google dentro del contenedor dado.
   * Retorna un Promise que se resuelve cuando el usuario complete el flujo.
   */
  async renderButton(container: HTMLElement): Promise<GoogleProfile> {
    if (!this.isConfigured) {
      throw new Error('Google Client ID no configurado. Ver environment.ts');
    }

    await this.initialize();

    return new Promise<GoogleProfile>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;

      // Limpiar contenedor y renderizar botón oficial
      container.innerHTML = '';
      google.accounts.id.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: 320,
        logo_alignment: 'center',
      });
    });
  }

  /**
   * Alternativa: usar One Tap (popup automático).
   */
  async promptOneTap(): Promise<GoogleProfile> {
    if (!this.isConfigured) {
      throw new Error('Google Client ID no configurado.');
    }

    await this.initialize();

    return new Promise<GoogleProfile>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
      google.accounts.id.prompt();
    });
  }

  /**
   * Decodifica el credential JWT de Google para extraer el perfil.
   * El credential es un JWT firmado por Google; el payload contiene:
   *   sub (googleId), email, name, picture, email_verified, etc.
   */
  private decodeCredential(credential: string): GoogleProfile {
    const parts = credential.split('.');
    if (parts.length !== 3) throw new Error('Credential JWT inválido');

    const payload = JSON.parse(
      atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/'))
    );

    if (!payload.sub || !payload.email) {
      throw new Error('Credential incompleto: falta sub o email');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
    };
  }
}
