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

            <!-- my-component.component.html -->
            <div>
                <p>Content inside the component</p>
            </div>

            /* my-component.component.css */
            :host {
                display: block;
                border: 2px solid #000;
                padding: 10px;
                background-color: #f0f0f0;
            }

3.  Explanation:- in above ex Here, :host applies styles to the root `<app-my-component> `element in the DOM. This means the component will be displayed as a block, with padding and a background color, affecting the root wrapper element.

## ::ng-deep or /deep/ or >>> [Deprecated]

1.  used to `style child elements of the component, even though those child elements may be inside other Angular components`.
2.  also, it should be `used for elements which we have received from CONTENT PROJECTION`
3.  It allows styles to `"pierce" the view encapsulation, making it easier to apply styles to nested components or deeply nested elements`.
4.  ::ng-deep is `deprecated` in Angular and will eventually be removed. However, it’s still widely used as a workaround until a proper solution is provided (`usually with the new Shadow DOM approach`).
5.  skip addition of any [ngcontent-c0] like angular class, because it breaks angular view encapsulation

        <!-- parent.component.html -->
        <app-child></app-child>

        <!-- child.component.html -->
        <p>This is the child component</p>


        /* parent.component.css */
        ::ng-deep app-child p {
            color: red;
            font-size: 20px;
        }

6.  Explanation: The ::ng-deep selector allows you to target the `<p>` element inside the `<app-child>` component from the parent component’s styles. Without ::ng-deep, Angular's view encapsulation would prevent the parent from styling the child component directly.

## structural directive \*ngIf

1.  structural directive are `internally converted to ng-template code`
2.  eg

        <component *ngIf="book[0] as book">
            // other html
        </component>

        will be converted to

        <ng-template [ngIf]="books" let-book>
            <component >
                // other html
            </component>
        </ng-template>

## template && ngTemplateOutlet

1.  templates ng-template can be passed as input to child component
2.  here blankImage template is passed to course-card as input

        // parent
        <ng-template #blankImage let-courseName="description">
            <p class="warn">{{courseName}} has no image yet.</p>
            <img src="/assets/empty-image.png">
        </ng-template>

        <course-card
                (courseSelected)="onCourseSelected($event)"
                    [course]="course" [noImageTpl]="blankImage">
            <course-image [src]="course.iconUrl"></course-image>
            <div class="course-description">
                {{ course.longDescription }}
            </div>
        </course-card>

        // child
        @Input() noImageTpl: TemplateRef<any>;

        <ng-container  *ngTemplateOutlet="noImageTpl;context: {description:course.description}" />

        whatever object is passed as part of context in *ngTemplateOutlet is sent to ngTemplate declared in parent

3.  ng-template used for
    - reuse a particular block of html either from parent or same template

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

1. @Optional()
   - will mark the service as optional and `will not break the app while bootstrap phase`, will break when it in being invoked
2. @Self()
   - when we `don't want the parent or global instance of service and want a private instance of service`
   - but we need to provide providers: [ serviceName] in that component
3. @SkipSelf()
   - if we want `to skip the component provider Service but want parent provided Service`
   - Parent should have the Service provided
4. @Host()
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

    - If one feels `some of the input to child component is static and will never change @Attribute()` in constructor instead of giving it as @input() to child
    - So that angular doesn't check for its value change on subsequent cycle.

            // Parent
            <course-card *ngFor="let course of  courses  "
                 (courseChanged)="save($event)"
                 type="beginner"                      // this is shared by attribute decorator for static data
                 [course]="course" />

            // child
            constructor(@Attribute('type') private type: string) { }

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

## 9. ngAfterNexRender

## 10. ngDestroy

- called only once when component is destroyed
- used to cleanup activity
- unsubscribe observables
