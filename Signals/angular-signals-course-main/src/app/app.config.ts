import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import {loadingInterceptor} from "./services/loading.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        //loadingInterceptor
      ])
    )
  ]
};
