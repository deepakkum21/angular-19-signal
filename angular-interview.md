# View Encapsulations

1. determines `how styles are applied to a component's template and how those styles interact with other parts` of the application
2. By default, Angular uses a `mechanism to prevent styles defined in one component from affecting other components, ensuring a level of style isolation`.
3. different view encapsulation strategies.
   - `Emulated (default)`
   - `ShadowDom`
   - `None`

## Emulated [Default] [special attributes] [ngContent-c0 / ngHost-C1]

1.  Angular `emulates Shadow DOM` behavior by `adding a unique attribute` to each element and its associated styles.`ng-reflect or ng-...`
    - `nghost-c0` - for component
    - `ngcontent-c1` - for elements inside the component
2.  Why use it?

    - `Ensures style isolation and encapsulation.`
    - `Prevents styles from leaking out to other components or interfering with other component styles.`

             // .css
             h1 { color: red; }

             //.html
             <app-my-component>
                 <h1 _ngcontent-c0="">Hello World</h1>
             </app-my-component>

## ShadowDom [when every browser supports then it might became default] #shadow-root

1.  Behavior
    - Angular uses the `native Shadow DOM [browser api's]` to `encapsulate the component’s view`.
    - This is a `web standard that provides true isolation of styles and structure`.
2.  How it works:

    - When you define styles in the component, `they are scoped within the shadow root of that component`.
    - The styles are `physically isolated from the rest of the page`, which ensures complete encapsulation.

             // .css
             h1 { color: red; }

             //.html
             <app-my-component>
                 #shadow-root (open)
                    <h1>Hello World</h1> // The h1 inside this component will be styled with the red color,
                                         // but the styles will not affect any other part of the page, even if there's another <h1> element.
             </app-my-component>

3.  Why use it?
    - Provides `true style encapsulation based on the Shadow DOM standard`.
    - Ideal `if you need strict style encapsulation that will not bleed into or affect global styles`.
4.  Limitation
    - a `browser feature, and support may vary depending on the browser`.

## NONE

1. Behavior:

   - Angular `does not add any encapsulation`. This means that `component styles are treated as global styles, and they can potentially affect other components`.

2. How it works:

   - The styles defined in the component will be `injected globally, and they will apply to all matching elements in the application, not just those inside the component’s template`.

3. Why use it?
   - If you want the component styles to apply globally across the app (e.g., defining global typography, themes, etc.).
     Useful for layout and design systems that need to apply to many parts of the app without being confined to a specific component.
4. Limitations:
   - This `breaks encapsulation, so styles may leak into other components`, potentially causing unintended side effects.

# :host , ::ng-deep (/deep/ and >>>), :host-context

https://blog.angular-university.io/angular-host-context/

1. `special selectors that allow you to target elements in a component’s template from its styles`.
2. These can be useful when you want to `apply styles from the component's styles to child elements or elements outside the component while respecting the Angular view encapsulation`.

## :host => target component root element / root container <app-comp> <book> [nghost-c0]

## ::ng-deep [dep] => target component child element from parent [ngcontent-c0] and skip addition of any special [ngcontent-c0] like angular class

## :host ::ng-deep => target from host the project element using `<ng-content>`

## :host-context(class-name) => theme related changes

## :host

1.  selector allows you to `target the component’s root element` (the element in the DOM that corresponds to the component).
2.  This can be useful when `you need to apply styles to the wrapper or container element of the component`.

```html
<!-- my-component.component.html -->
<div>
  <p>Content inside the component</p>
</div>

/* my-component.component.css */ :host { display: block; border: 2px solid #000;
padding: 10px; background-color: #f0f0f0; }
```

3.  Explanation:- in above ex Here, :host applies styles to the root `<app-my-component> `element in the DOM. This means the component will be displayed as a block, with padding and a background color, affecting the root wrapper element.

## ::ng-deep or /deep/ or >>> [Deprecated]

1.  used to `style child elements of the component, even though those child elements may be inside other Angular components`.
2.  also, it should be `used for elements which we have received from CONTENT PROJECTION`
3.  It allows styles to `"pierce" the view encapsulation, making it easier to apply styles to nested components or deeply nested elements`.
4.  ::ng-deep is `deprecated` in Angular and will eventually be removed. However, it’s still widely used as a workaround until a proper solution is provided (`usually with the new Shadow DOM approach`).
5.  skip addition of any [ngcontent-c0] like angular class, because it breaks angular view encapsulation

```html
<!-- parent.component.html -->
<app-child></app-child>

<!-- child.component.html -->
<p>This is the child component</p>

/* parent.component.css */ ::ng-deep app-child p { color: red; font-size: 20px;
}
```

6.  Explanation: The ::ng-deep selector allows you to target the `<p>` element inside the `<app-child>` component from the parent component’s styles. Without ::ng-deep, Angular's view encapsulation would prevent the parent from styling the child component directly.

## structural directive \*ngIf

1.  structural directive are `internally converted to ng-template code`
2.  eg

```html
<component *ngIf="book[0] as book"> // other html </component>

will be converted to

<ng-template [ngIf]="books" let-book>
  <component> // other html </component>
</ng-template>
```

## template && ngTemplateOutlet

1.  `directive used to render an Angular template dynamically.`
2.  It allows you to `insert the content of a template into your view at runtime`, providing flexibility in how the content is structured and displayed.

3.  templates ng-template can be passed as input to child component
4.  here blankImage template is passed to course-card as input

```html
// parent
<ng-template #blankImage let-courseName="description">
  <p class="warn">{{courseName}} has no image yet.</p>
  <img src="/assets/empty-image.png" />
</ng-template>

<course-card
  (courseSelected)="onCourseSelected($event)"
  [course]="course"
  [noImageTpl]="blankImage"
>
  <course-image [src]="course.iconUrl"></course-image>
  <div class="course-description">{{ course.longDescription }}</div>
</course-card>

// child
@Input() noImageTpl: TemplateRef<any>;

  <ng-container
    *ngTemplateOutlet="noImageTpl;context: {description:course.description}"
  />

  whatever object is passed as part of context in *ngTemplateOutlet is sent to
  ngTemplate declared in parent</any
>
```

5.  ng-template used for
    - reuse a particular block of html either from parent or same template

# ngComponentOutlet [Dynamic component loading]

- directive is a powerful feature `that allows you to dynamically render a component at runtime. `
- This directive is part of the CommonModule, and it lets you `specify which component should be displayed inside a container based on certain conditions or data at runtime, rather than at compile-time.`

        // Component A
        @Component({
            selector: 'app-component-a',
            template: `<h2>This is Component A</h2>`
        })
        export class ComponentA {}

        // ComponentB
        @Component({
            selector: 'app-component-b',
            template: `<h2>This is Component B</h2>`
        })
        export class ComponentB {}

        // Parent With ngComponentOutlet
        @Component({
        selector: 'app-parent',
        template: `
            <h1>Dynamic Component Rendering</h1>
            <ng-container *ngComponentOutlet="outletComponent"></ng-container>
            <button (click)="toggleComponent()">Toggle Component</button>
        `
        })
        export class ParentComponent implements OnInit {
            outletComponent: any;

            constructor() {}

            ngOnInit() {
                // Initially load ComponentA
                this.outletComponent = ComponentA;
            }

            toggleComponent() {
                // Toggle between ComponentA and ComponentB
                this.outletComponent = this.outletComponent === ComponentA ? ComponentB : ComponentA;
            }
        }

- `Passing Data to Dynamically Loaded Components`

        // Child
        @Component({
            selector: 'app-dynamic-child',
            template: `<h2>Received Data: {{data}}</h2>`
        })
        export class DynamicChildComponent {
            @Input() data: string = '';
        }

        // Parent
        @Component({
        selector: 'app-parent',
        template: `
            <h1>Dynamic Component with Input</h1>
            <ng-container *ngComponentOutlet="outletComponent; injector: dynamicComponentInjector"></ng-container>
            <button (click)="toggleComponent()">Toggle Component</button>
        `
        })
        export class ParentComponent {
            outletComponent = DynamicChildComponent;

            dynamicComponentInjector = this.createInjector();

            toggleComponent() {
                // Toggle logic if necessary
            }

            // Creating an injector to pass data to the dynamically created component
            private createInjector() {
                const injector = Injector.create({
                providers: [
                    {
                    provide: 'data',
                    useValue: 'Hello from Parent Component!',
                    }
                ]
                });
                return injector;
            }
        }

## Angular DI

1. Components class doesn't know how to instantiate the Service which are injected.
2. `Angular's provider provide the instantiated service via DI, via factory function`
   - using `PROVIDERS array`
   - `@injectable ({provideIn: root/module name})`

## Create own provider

        // course Service somwhere created
        // CoursesService

        // Course component or somwehere globally
        // Create function returning the new Object of Service with dependency
        function courseServiceProvider(http: HttpClient) = {
            return CoursesService(http)
        }

        // Create a unique injector using InjectionToken
        export const COURSE_SERVICE = new InjectionToken<CoursesService>('COURSE_SERVICE')  // pass unique name

        // now in providers array at app config or component level
        providers: [
            {
                provide: COURSE_SERVICE,  // can give Service class name too
                useFactory: courseServiceProvider,
                deps: [
                    HttpClient    // dependency which the Service have DI
                ]
            }
        ]

        // now in the constructor or component DI via unique name & inject fn
        constructor(@inject('COURSE_SERVICE') private courseService CoursesService) {

        }

        or
        courseService = inject(CoursesService); // when in provide given CoursesService

        ------------------------------------------

        // the above providers things acn be further made easy
        providers: [
            {
                provide: CoursesService,
                useClass: CoursesService
            }
        ]
        // className is always unique
        // when using like able no need to create InjectionToken and also not req to create a providerFunction

        -------------------------------------------

        // again it can be simplified
         providers: [
            CoursesService
        ]
        // Since angular knows how to instantiate class using constructor

## Tree Shakeable Service

1. if services are `instantiated by providers: [] then even if the service is not being used anywhere the service will be added in the bundle`.
2. But if the service are `instantiated using @injectable({providedIn: ''}), then if only services are used then only it will added as part of bundle`.

## App config Related Service

        export interface AppConfig {
            apiUrl:string;
            courseCacheSize:number;
        }


        export const APP_CONFIG:AppConfig = {
            apiUrl: 'http://localhost:9000',
            courseCacheSize: 10
        }

        // tre shakable => if not used the service will not be added as part of bundle
        export const CONFIG_TOKEN =
            new InjectionToken<AppConfig>('CONFIG_TOKEN',
                {
                    providedIn: 'root',
                    factory: () => APP_CONFIG   // can use useValue: APP_CONFIG also
                });

        // usage
        ✔️ @Inject(CONFIG_TOKEN) private config: AppConfig
        ❌ private config: AppConfig   // will not work since interface as not present during runtime need to provide unique name instead of interfaceName

## Other DI Decorators

### 1. @Optional()

- will mark the service as optional and `will not break the app while bootstrap phase`, will break when it in being invoked

### 2. @Self()

- when we `don't want the parent or global instance of service and want a private instance of service`
- but we need to provide providers: [ serviceName] in that component

### 3. @SkipSelf()

- if we want `to skip the component provider Service but want parent provided Service`
- Parent should have the Service provided

### 4. @Host()

- if we `want to have to host provided Service Dependency and not global or parent`
- generally used in case of directive, where directive binded Host Dependency needed

# Change Detection

1. Default
2. OnPush
3. Custom Change Detection [ ChangeDetectorRef]

## Default

1. If anything as lead to change of the value, the angular will `look check from top to bottom` if changes to that particular thing has led to changes to any other part
2. not performant

## OnPush

1. Angular is `not going check the changes by analyzing each of the expression of the template` instead it will detect
   - `the changes of the input()`
   - `incase of event triggered`
   - `if an observable is registered using async pipe in template`
2. performance is better as it skips the branch is input() is not changed by not mutating the object
3. `use immutable object`

## Custom Change Detection [ ChangeDetectorRef]

1.  when we manually want angular to look for changes i.e. invoke change detection
2.  Should not be used frequently

        cd= inject(ChangeDetectorRef);

        ngDoCheck() {
            cd.markForCheck();  //best place  when we want to invoke the change detection
        }

# Performance Optimization

1.  OnPush
2.  Attribute Decorator
3.  @defer

    - If one feels `some of the input to child component is static and will never change @Attribute()` in constructor instead of giving it as @input() to child
    - So that angular doesn't check for its value change on subsequent cycle.

            // Parent
            <course-card *ngFor="let course of  courses  "
                 (courseChanged)="save($event)"
                 type="beginner"                      // this is shared by attribute decorator for static data
                 [course]="course" />

            // child
            constructor(@Attribute('type') private type: string) { }

# @Defer

https://angular.dev/guide/templates/defer

- enables a more `efficient way to load and render components lazily`
- Components, directives, pipes, and any component CSS styles can be deferred when loading an application.
- allows for `components to be loaded on-demand,` which can significantly improve the initial load time of an Angular application
- helps you to `defer the initialization of components until they are needed`, which can be especially useful for performance optimization
- they need to meet two conditions:
  - They `must be standalone`.
  - They `cannot be referenced outside of @defer blocks within the same file`
-           @defer {
                    // code which can be loaded on demand
            }
- `by default @defer === @defer(on idle; prefetch on idle)`
  - i.e. prefetching of data is triggered when browser is idle
  - and then when browser is idle then the @defer block is triggered but both are different triggers

## 1. @Placeholder

- the part of `code which will be shown until @defer part is being loaded`
- optional block that declares `what content to show before the @defer block is triggered.`
- this will `loaded eagerly with all its dependencies`
- accepts an optional parameter to specify the minimum amount of time that this placeholder should be shown after the placeholder content initially renders.
-          @defer {
                <large-component />
            } @placeholder (minimum 500ms) {
                <p>Placeholder content</p>
            }

## 2. @loading

- is an `optional block that allows you to declare content that is shown while deferred dependencies are loading`. It replaces the @placeholder block once loading is triggered
- `dependencies are eagerly loaded` (similar to @placeholder).
- The @loading block accepts `two optional parameters` to help prevent fast flickering of content
  - `minimum` - the minimum amount of time that this placeholder should be shown
  - `after` - the amount of time to wait after loading begins before showing the loading template
-       @defer {
            <large-component />
        } @loading (after 10ms; minimum 10ms){
            <img alt="loading..." src="loading.gif" />
        } @placeholder {
            <p>Placeholder content</p>
        }

## 3. @error

- The @error `block is an optional block that displays if deferred loading fails. `
- Similar to @placeholder and @loading, the dependencies of the `@error block are eagerly loaded.`
-           @defer {
                <large-component />
            } @error {

                <p>Failed to load large component.</p>
            }
            - on specifies a condition for when the @defer block is triggered.

# Controlling deferred content loading with triggers

- When a @defer block is triggered, it replaces placeholder content with lazily loaded content.
- `Multiple event triggers can be defined by separating them with a semicolon, ; and will be evaluated as OR conditions`.
- There are two types of triggers:
  - `on`
  - `when`

## A. `on` trigger

- on `specifies a condition` for when the @defer block is triggered.
  | Trigger | Description |
  | ------- | ----------- |
  |`idle` |Triggers when the `browser is idle`. `Default` for @defer when not specified any trigger|
  |`viewport` |Triggers when `specified content enters the viewport`|
  |`interaction`| Triggers when the `user interacts with specified element`|
  |`hover` |Triggers when the `mouse hovers over specified area`|
  |`immediate`| Triggers `immediately after non-deferred content has finished rendering`|
  |`timer` |Triggers `after a specific duration`|

### 1. idle

- The idle trigger loads the deferred content `once the browser has reached an idle state`, based on `requestIdleCallback`.
- This is the `default behavior with a defer block`.

        <!-- @defer (on idle) -->
        @defer {
            <large-cmp />
        } @placeholder {
            <div>Large component placeholder</div>
        }

        <!-- @defer (on idle) --> both are same
        @defer (on idle) {
            <large-cmp />
        } @placeholder {
            <div>Large component placeholder</div>
        }

### 2. viewport

- The viewport trigger` loads the deferred content when the specified content enters the viewport` using the `Intersection Observer API`

        @defer (on viewport) {
            <large-cmp />
        } @placeholder {
            <div>Large component placeholder</div>
        }

        <div #greeting>Hello!</div>    // greeting element in watched to enter the viewport
        @defer (on viewport(greeting)) {
            <greetings-cmp />
        }

### 3. interaction

- The interaction trigger `loads the deferred content when the user interacts with the specified element through click or keydown events`.
- `By default, the placeholder acts as the interaction element`. Placeholders used this way must have a single root element.

        @defer (on interaction) {
            <large-cmp />
        } @placeholder {
            <div>Large component placeholder</div>
        }

- we can `specify a template reference variable in the same template as the @defer block as the element that is watched to enter the viewport` . This variable is passed in as a parameter on the viewport trigger.

        <div #greeting>Hello!</div>
        @defer (on interaction(greeting)) {
            <greetings-cmp />
        }

### 4. hover

- The hover `trigger loads the deferred content when the mouse has hovered over the triggered area through` the mouseover and focusin events.
- By `default, the placeholder acts as the interaction element`. Placeholders used this way must have a single root element.

        @defer (on hover) {
          <large-cmp />
        } @placeholder {
          <div>Large component placeholder</div>
        }

- Alternatively, we can `specify a template reference variable in the same template as the @defer block as the element that is watched to enter the viewport`. This variable is passed in as a parameter on the viewport trigger

        <div #greeting>Hello!</div>
        @defer (on hover(greeting)) {
          <greetings-cmp />
        }

### 5. immediate

- The immediate trigger `loads the deferred content immediately`.
- This means that the `deferred block loads as soon as all other non-deferred content has finished rendering

        @defer (on immediate) {
          <large-cmp />
        } @placeholder {
          <div>Large component placeholder</div>
        }`

### 6. timer

- The timer `trigger loads the deferred content after a specified duration.`
- The duration parameter must be specified in milliseconds (ms) or seconds (s).

        @defer (on timer(500ms)) {
          <large-cmp />
        } @placeholder {
          <div>Large component placeholder</div>
        }

## B. when [custom trigger]

- The when trigger `accepts a custom conditional expression` and loads the deferred content when the condition becomes truthy.
- This is a `one-time operation` the `@defer block does not revert back to the placeholder if the condition changes to a falsy value after becoming truthy`.

        @defer (when condition) {
          <large-cmp />
        } @placeholder {
          <div>Large component placeholder</div>
        }

## prefetch [Prefetching data with prefetch]

- This trigger lets you `load the JavaScript associated with the @defer block before the deferred content is shown`.
- Prefetching enables more advanced behaviors, `such as letting you start to prefetch resources before a user has actually seen or interacted with a defer block, but might interact with it soon, making the resources available faster.`
- You can specify a `prefetch trigger similarly to the block's main trigger`, but `prefixed with the prefetch keyword`.
- The `block's main trigger and prefetch trigger are separated with a semi-colon character (;)`.
- one can have custom `when trigger` also

        @defer (on interaction; prefetch on idle) {
          <large-cmp />
        } @placeholder {
          <div>Large component placeholder</div>
        }

# Life Cycle Hooks

- life cycle hooks are not to be called manually
- these are called by angular internally depending on the stage/life of the component

## 1. Constructor

- `should not have initialization logic`
- access to input variable are not available
- `best for DI`

## 2. ngOnChanges(changes: SimpleChange)

- called `after each change detection`
- `will be called whenever the input gets changed`
- when the reference gets changed and i.e. not by mutating
- SimpleChange has previous and currentValue

## 3. ngOnInIt

- `called only once`

## 4. ngDoCheck

- called `after each change detection`
- `custom change detection`

## 5. ngContentInit

- only once called
- `any initialization done for @contentChild() property`

## 6. ngContentChecked

- `called after each change detection`
- this is `called when the content projection elements are finished changes`
- we `cannot modify any property which are being used as part of that content projection`, because it will defeat the purpose of this lifecycle hook as it will run in infinite loop
- last place to modify data of the component except the projected property

## 7. ngViewInit

- only once called
- `any initialization done for @viewChild() property`

## 8. ngViewChecked

- `called after each change detection`
- cannot and should modify data which are being used in the component view, angular will not now about this
- useful to apply scrolling , setting focus after adding elements to list, anything which doesn't affect the view

## 9. afterRender

- allows you to `register a callback that executes after every render cycle.`
- Dynamic Content Sizing

## 10. afterNextRender

- `registers a callback that executes ONLY ONCE after the next render cycle, when the DOM is loaded.`
- uses case
  - Initializing Third-Party Libraries,
  - Detaching Temporary Elements
  - setting Up Element Observers

## 11. ngDestroy

- called only once when component is destroyed
- used to cleanup activity
- unsubscribe observables

# @Pipe

- are used for transformation
- @Pipe is used
- `implements PipeTransform` interface and has one method `transform`

  - 1st argument :- value which needs transformation
  - 2nd argument :- parameter to pipe
  - 3rd .....

          @Pipe({
              name: 'nameofpipe',
              pure: true  //default
          })
          export class DemoPipe implements PipeTransform{
              transform(value: <t>, param1)
          }

## 1. Pure Pipe

- By `default pipes are pure to improve performance`
- will `not be triggered again until reference of the value on which transformation is applied changes `
- if mutated input value then will not trigger
-

## 2. Impure Pipe

- can add `pure: false` to decorator
- decreased performance
- `mutated input will also trigger the pipe`

# Ways to unsubscribe Observable

## 1. async pipe

- async pipe automatically takes care of unsubscribing for that observable
- can use the async pipe to subscribe to observables directly in the template. `Angular automatically manages the subscription and unsubscribes when the component is destroyed.`

            <test-component> {{ testObservable$ | async}}

            testObservable$ = someService.getNames()

## 2. takeUntil

        private destroy$ = new Subject<void>();

        observable$
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => console.log(data));

        ngOnDestroy() {
            this.destroy$.next();
            this.destroy$.complete();
        }

## 3. take(1) [if certain only 1 value will be emitted]

        observable.pipe(take(1)).subscribe(
            value => console.log(value),
            error => console.error(error),
            () => console.log('Completed')
        );

## 4. takeUntilDestroyed(destroyRef?: DestroyRef)

- When using `inside current injection context`

            constructor(private service: DataService) {
                this.service.getData()
                .pipe(takeUntilDestroyed())
                .subscribe(response => this.data = response)
            }

- When using `outside current injection context`

            destroyRef = inject(DestroyRef)

            constructor(private service: DataService) {}

            ngAfterViewInit() {
                this.service.getData()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(response => this.data = response)
            }

## 5. Manual unsubscribe

            allSubscriptions: Subscriptions[] = [];
            mySubscription: Subscription;

            myMethod() {
                mySubscription = this.myCustomService.getData().subscribe();
                this.allSubscriptions.push(this.mySubscription)
            }

            ngOnDestroy(){
                this.allSubscriptions.forEach((sub: Subscription) => {
                    sub.unsubscribe();
                })
            }

# i18n

- 18 chars between i&n
- `add i18n attribute` for i18n
- `ng xi18n` to `extract the messages.xlf file`
- `<h1 i18n="meaning_of_the_message | description_of_message @@custom_unique_id> MESSAGE <h1>`
- `unique id will always gets changed when MEANING and MESSAGE gets changed`

## Pluralization

`<div i18n> { coursesTotal, plural, =0 {No Course present}, =1 {One Course is present}, other { total {{ courseTotal}} course are present }} <div>`

# Custom Elements

- Custom Elements can be `instantiated by browser compared to regular elements of angular where angular will instantiate them`
- Angular Custom Elements are a way of `encapsulating Angular components into reusable Web Components that can be used outside of Angular applications`.
- Web Components are a browser-native feature that allows for the creation of reusable and self-contained elements.
- By using Angular Custom Elements, `you can package your Angular components into custom HTML tags, making them compatible with non-Angular frameworks or even vanilla JavaScript.`
- Installing Necessary Dependencies
  1. npm install @angular/elements
  2. npm install @webcomponents/custom-elements
-       // custom ele component
        <MyCustomElement> <MyCustomElement>

        const el = createCustomElement(MyCustomElementComponent, { injector: this.injector });
        customElements.define('my-custom-element', el);

        // needs to add MyCustomElementComponent in entries array of AppModule
        @NgModule({
            entries: [MyCustomElementComponent]
        })

- Now MyCustomElement can be used as normal html element
