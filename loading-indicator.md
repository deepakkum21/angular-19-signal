## Angular Loading Indicator

[Angular Loading Indicator](https://blog.angular-university.io/angular-loading-indicator/`)

We will cover the following topics:

- Design goals for the loading indicator
- Building the loading indicator service
- Building the loading indicator component
- Using the loading indicator globally
- Automatically showing the loading indicator when loading data from the backend
- Don't turn on the loading indicator for certain HTTP requests
- Integrating the loading indicator with the router
- Proving an alternative UI for the loading indicator

```ts
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
```

### Building the loading indicator component

```css
.spinner-container {
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.32);
  z-index: 2000;
}
```

```html
@if(loading$ | async) {

<div class="spinner-container">
  @if(customLoadingIndicator) {
  <ng-container *ngTemplateOutlet="customLoadingIndicator" />

  } @else {
  <mat-spinner />
  }
</div>
}
```

```ts
@Component({
  selector: 'loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
  imports: [MatProgressSpinnerModule, AsyncPipe, NgIf, NgTemplateOutlet],
  standalone: true,
})
export class LoadingIndicatorComponent implements OnInit {
  loading$: Observable<boolean>;

  @Input()
  detectRouteTransitions = false;

  @ContentChild('loading')
  customLoadingIndicator: TemplateRef<any> | null = null;

  constructor(private loadingService: LoadingService, private router: Router) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    if (this.detectRouteTransitions) {
      this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.loadingOff();
            }
          })
        )
        .subscribe();
    }
  }
}
```

### Using the loading indicator globally

```html
<ul>
  <li><a routerLink="/contact">Contact</a></li>
  <li><a routerLink="/help">Help</a></li>
  <li><a routerLink="/about">About</a></li>
</ul>

<router-outlet />

<loading-indicator />
```

### use the loading indicator with async/await code

```ts
@Component({
  selector: 'child-component',
  standalone: true,
  imports: [CommonModule],
  template: ` <button (click)="onLoadCourses()">Load Courses</button> `,
})
export class ChildComponentComponent {
  constructor(private loadingService: LoadingService) {}

  onLoadCourses() {
    try {
      this.loadingService.loadingOn();

      // load courses from backend
    } catch (error) {
      // handle error message
    } finally {
      this.loadingService.loadingOff();
    }
  }
}
```

### Automatically showing the loading indicator when loading data from the backend

```ts
export const SkipLoading = new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check for a custom attribute
    // to avoid showing loading spinner
    if (req.context.get(SkipLoading)) {
      // Pass the request directly to the next handler
      return next.handle(req);
    }

    // Turn on the loading spinner
    this.loadingService.loadingOn();

    return next.handle(req).pipe(
      finalize(() => {
        // Turn off the loading spinner
        this.loadingService.loadingOff();
      })
    );
  }
}
```

```ts
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      RouterModule,
      LoadingService
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
});
```

### Don't turn on the loading indicator for certain HTTP requests

```ts
this.http.get('/api/courses', {
  context: new HttpContext().set(SkipLoading, true),
});
```

### Integrating the loading indicator with the router

```html
<loading-indicator [detectRouteTransitions]="true" />
```

### Proving an alternative UI for the loading indicator

```html
<loading-indicator>
  <ng-template #loading>
    <div class="custom-spinner">
      <img src="custom-spinner.gif" />
    </div>
  </ng-template>
</loading-indicator>
```
