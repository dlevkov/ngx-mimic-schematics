import { enableProdMode, isDevMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const meta = document.createElement('meta');
meta.setAttribute(
  'Content-Security-Policy',
  `default-src 'none';
  img-src 'self' data: http: https:;
  font-src fonts.gstatic.com 'self' data:;
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src fonts.googleapis.com 'self' 'unsafe-inline';
  connect-src 'self' https://*.launchdarkly.com ` +
    environment.apiDomain +
    `;`
);
document.head.appendChild(meta);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

if (isDevMode) {
  (require as any).ensure(['mimic'], require => {
    require('mimic');
  });
}
