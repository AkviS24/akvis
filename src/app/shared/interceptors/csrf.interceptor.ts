import { HttpInterceptorFn } from '@angular/common/http';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.url.startsWith('/api/');
  const isWriteRequest = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  const csrfToken = getCookie('csrftoken');

  if (!isApiRequest || !isWriteRequest || !csrfToken) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        'X-CSRFToken': csrfToken,
      },
    })
  );
};
