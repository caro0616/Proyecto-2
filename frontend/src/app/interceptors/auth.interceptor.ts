import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional que adjunta:
 *  - Authorization: Bearer <token>
 *  - x-user-id: <userId>   (requerido por cart y orders)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const userId = localStorage.getItem('user_id');

  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  if (userId) {
    headers = headers.set('x-user-id', userId);
  }

  return next(req.clone({ headers }));
};
