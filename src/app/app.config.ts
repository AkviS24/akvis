import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { csrfInterceptor } from './shared/interceptors/csrf.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withXhr(), withInterceptors([csrfInterceptor])),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
  ],
};
