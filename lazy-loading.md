# Lazy Loading [standalone]

        // app.routes.ts
        {
            path: 'routePath',
            loadChildren: () => import('./feature/feature.routes').then((r) => r.FEATURE_ROUTES)
        }

        //feature.routes.ts
        export const FEATURE_ROUTES = [
            {
                path: 'routePath',
                component: BaseComponent,
                canActivate: [someGuard],
                children: [
                    {
                        path: 'routePath',
                        loadComponent: () => import('./feature.component').then((c) => c.FEATURE.component),
                        canActivate: [someGuard],
                    }
                ]
            }
        ]

# Preloading Strategies

## 1. No Preloading [default]

- Disables preloading entirely
- `lazy-loaded modules/components are only fetched when user navigates` to them

## 2. PreloadAllModules

- `preload all lazy loaded modules/components in the background after initial app load`

        // app-config.ts
        providers: [
            provideRouter([...routes], withPreloading(PreloadAllModules))
        ]

## 3. Quicklink preloading strategy

- its a npm lib `ngx-quicklink`
- The library `prefetches the content associated with all links currently visible on the page, in case the user is on a fast network. `
- `quicklink does not perform any prefetching if they are on a 2G network or slower`. To detect the user’s network, Guess.js and quicklink use navigator.connection.effectiveType.
- Here are the key features of ngx-quicklink:
  - `Detects routerLinks within the viewport (using Intersection Observer)`
  - `Waits until the browser is idle (using requestIdleCallback)`
  - `Checks if the user isn’t on a slow connection (using navigator.connection.effectiveType) or has data-saver enabled (using navigator.connection.saveData)`
  - Prefetches the lazy loaded modules using Angular’s prefetching strategy
- https://blog.mgechev.com/2018/12/24/quicklink-angular-prefetching-preloading-strategy/

## 4. CustomPreloading

- `implement interface PreloadingStrategy interface to override preload method`
- based on preload flag

        @Injectable({ providedIn: 'root' })
        export class FlagBasedPreloadingStrategy implements PreloadingStrategy {
            preload(route: Route, load: () => Observable<any>): Observable<any> {
                return route.data?.['preload'] ? load() : of(null);
            }
        }

        {
            path: 'dashboard',
            loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
            data: { preload: true }
        },

- based on Network Conditions

        export class NetworkAwarePreloadingStrategy implements PreloadingStrategy {
            preload(route: Route, load: () => Observable<any>): Observable<any> {
                const connection = navigator.connection;
                const isFastConnection = connection?.effectiveType === '4g' || !connection?.saveData;

                return isFastConnection && route.data?.['preload'] ? load() : of(null);
            }
        }

- Based on Device Type

        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        export class DeviceAwarePreloadingStrategy implements PreloadingStrategy {
            preload(route: Route, load: () => Observable<any>): Observable<any> {
                return !isMobile && route.data?.['preload'] ? load() : of(null);
            }
        }

- based on delay time

        @Injectable({  providedIn: 'root' })
        export class CustomPreloadingStrategy implements PreloadingStrategy {
            preload(route: Route, load: () => Observable<any>): Observable<any> {
                // Add a condition to check for modules you want to preload
                if (route.data && route.data['preload']) {
                // Delay before preloading the module (in ms)
                const delayTime = route.data['delay'] || 1000; // Default delay of 1000ms (1 second)
                return of(null).pipe(
                    delay(delayTime),
                    switchMap(() => load())
                );
                }
                return of(null);
            }
        }

        {
            path: 'about',
            component: AboutComponent,
            data: { preload: true, delay: 2000 } // Preload with a 2-second delay
        },
