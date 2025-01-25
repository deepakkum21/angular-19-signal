# Signals

1. https://blog.angular-university.io/angular-signal-components/
2. https://blog.angular-university.io/angular-signals/
3. https://blog.angular-university.io/angular-viewchild-contentchild/

# How signal useful and why to use

1. Previously using Zone.js was used to compare the values with the old values before and after an event to know if there is any change and this has to be done for each component in the tree and if it has changed it was marked as dirty and we will re-rendered in the next change detection cycle

2. Using signal now Angular can simply keeping track of signal (subscribing - notified when changed), to know when the data has been modified and can mark those component in the component tree as dirty

3. can avoid expression has changed after it was checked error

4. Reactive way

### QQQQ => Why would we want to switch to a signal-based approach for handling our data?

1. The advantage is that with signals, we can easily detect when any part of the application data changes, and update any dependencies automatically.

2. Now imagine that the Angular change detection is plugged into the signals of your application, and that Angular knows in which components and expressions every signal is being used.

3. This would enable Angular to know exactly what data has changed in the application, and what components and expressions need to be updated in response to a new signal value.

4. There would no longer be the need to check the whole component tree, like in the case of default change detection!

5. If we give Angular the guarantee that all the application data goes inside a signal, Angular all of a sudden has all the necessary information needed for doing the most optimal change detection and re-rendering possible.

6. Angular would know how to update the page with the latest data in the most optimal way possible.
7. And that is the main performance benefit of using signals!
8. Just by wrapping our data in a signal, we enable Angular to give us the most optimal performance possible in terms of DOM updates.

## Signals

1. By Default signals are writable
   `age = Signal(10)`
2. Signal must be initailized
3. to access value just call the signal variable as a function i.e invoke
   age() // to read value
4. To set /update
   - `signalVar.set(newVal)` // prmitive
   - `signalVar.update( oldVal => newValue)`
   - always use update/set API for nonprimitive/ object/ array
5. Signals are only used for change dectection by angular if they are modified/new value and not when mutated
6. Readonly Signals
   - `signal(0).asReadonly`
   - `computed()`

## Computed Signal

1.  these are readonly signal
2.  These are derived signal from other signal.
3.  When a signal updates, all its dependent/derived signals will then get updated automatically
4.  should always return values
5.  To have computed signal just need to invoke atleast one signal in the body to initialize the computed signal as a signal always needs a initial value

        counter = signal(0);

        derivedCounter = computed(() => {
        return this.counter() \* 10;
        });

        tenXCounter = computed(() => {
        return this.derivedCounter() \* 10;
        })

### QQQQ => Can we read the value of a signal from a computed signal without creating a dependency i.e. when the source signal gets updated it should not trigger computed signal to be invoked?

Ansss=> _yes using untracked_

        counter = signal(0);

        derivedCounter = computed(() => {
        return _*untracked*_(this.counter) \* 10;
        });

### QQQQ => What is the major pitfall to look out for when creating computed signals?

1.  If a derived signal depends on a source signal, we need to make sure we call the source signal every time that the compute function gets called.Otherwise, the dependency between the two signals will be broken
2.  Angular will only create the dependency if source Signal is getting called everytime when computed signal is called.

        // wrong way
        counter = signal(0);
        multiplier: number = 0;

        derivedCounter = computed(() => {
        if (this.multiplier < 10) {
            return 0;
        } else {
            return this.counter() \* this.multiplier;
            // dependency is never created as source signal is not getting invoked
            }
        });

        // correct way
        counter = signal(0);
        multiplier: number = 0;

        derivedCounter = computed(() => {
            if (this.counter() === 0) {
                return 0;
            } else {
                return this.counter() \* this.multiplier;
            }
        });

### QQQQ => Are signal dependencies determined based only on the initial call to the computed function?

1. No, instead the dependencies of a derived signal are identified dynamically based on its last calculated value.
2. So with every new call of the computed function, the source signals of the computed signal are identified again.
3. This means that a signal's dependencies are dynamic, they are not fixed for the lifetime of the signal.

### QQQQ => Overriding the signal equality check

1.  Yes, default equality is ===
2.  This equality check is important because a signal will only emit a new value if the new value that we are trying to emit is different then the previous value, for performance optimization.

3.  The default behavior however is based on "===" referential equality, which does not allow us to identify arrays or objects that are functionally identical. as SET/UPDATE API gives new object.

4.  for that we need to verride equality

        object = signal(
            {
                id: 1,
                title: "Angular For Beginners",
            },
            {
                equal: (a, b) => {
                return a.id === b.id && a.title == b.title;
            },
        });

## Detecting signal changes with the effect() API

1.  computed() API, gives us way to know when a dependent Signal has changed, and resulting in calculating new value for dervived Signal.
2.  But what if instead of calculating the new value of a dependent signal, we just want to detect that a value has changed for some other reason?
3.  a situation where you need to detect that the value of a signal (or a set of signals) has changed to perform some sort of side effect, that does not modify other signals
4.  in effect() there should be invoking of Signal (not in condition/setTimeout), because of this effect() runs atleast once.
5.  Best place to define effect is in constractor,
    why?
    - To know the dependecy Injection Context, so that while discarding the component on ngDestroy the effect also gets destro to avoid memory leak
6.  Defining DI context manually (for GC) when effect() defined other than constructor

    - Inject the Injector context using inject(Injector) same as constructor(injector: Injector)

             counter = signal(0,);
             injector = inject(Injector);
             increment() {
                 effect(() => {
                     this.counter();
                 }, {
                     injector: this.injector
                 })
             }

7.  Just like in the case of the computed() API, the signal dependencies of an effect are determined dynamically based on the last call to the effect function.
    - if no signal invocation is done in any of the effect() call, the the signal depency gets broken.
8.  UseCase
    - logging the value of a number of signals using a logging library
    - exporting the value of a signal to localStorage or a cookie [saving form data]
    - saving the value of a signal transparently to the database in the background

## How to clean up effects manually

1.  By deafault when effect defined inside contructor it know its DI context or when passed injector context using injector, as options to the effect, so the component gets destroyed the effect will get cleanedup.
2.  an effect() can be manually destroyed by calling destroy() on the EffectRef instance that it returns when first created.
3.  In these cases, you probably also want to disable the default cleanup behavior by using the manualCleanup option:

        counter = signal(0);
        injector = inject(Injector);
        effectRef: EffectRef | null = null;
        increment() {
            this.effectRef = effect(() => {
                this.counter();
            }, {
                injector: this.injector,
                manualCleanup: true //disable default cleanup behaviour
            })
        }

        cleanUp() {
            this.effectRef?.destroy();
        }

## Performing cleanup operations when an effect is destroyed

1.  Sometimes just removing the effect function from memory is not enough for a proper cleanup.
2.  On some occasions, we might want to perform some sort of cleanup operation like closing a network connection or otherwise releasing some resources when an effect gets destroyed.
3.  cleanup() will be called everytime the effect() finsihed its job and also it will be called when the effect() is cleanedup as part of GC or manually.
4.  usecase:-

    - unsubscribing from an observable
    - closing a network or database connection
    - clearing setTimeout or setInterval

             counter = signal(0);
             constructor(injector: Injector) {
                 effect((onCleanup) => {
                     this.counter();
                     onCleanup(() => {
                         // cleanup activity
                         // will be called everytime effect() is called
                         // in last and also will destroy
                     })
                     }
                 );
             }

## Signals and OnPush components

1. OnPush components are components that are only updated when their
   - input properties change, or
   - when Observables subscribed with the async pipe emit new value
2. They are not updated when their input properties are mutated.
3. When signals are used on a component, Angular marks that component as a dependency of the signal. When the signal changes, the component is re-rendered.

### QQQQ => Can I create signals outside of components/stores/services?

Anss => Absolutely! You can create signals anywhere you want. No constraint says that a signal needs to be inside a component, store, or service.

### QQQQ => How do Signals compare to RxJs?

1. signals are a great alternative to RxJS Behavior Subjects
2. Signals are not a direct replacement for RxJs

## afterRender VS afternextRender

### afterRender:

1. allows you to register a callback that executes after every render cycle.
2. Dynamic Content Sizing

### afterNextRender:

1. registers a callback that executes ONLY ONCE after the next render cycle, when the DOM is loaded.
2. uses case
   a. Initializing Third-Party Libraries,
   b. Detaching Temporary Elements
   c. Setting Up Element Observers

## Signal inputs with input()

1.  input() API function is a direct replacement for the @Input() decorator.

        book = input<Book>() //as signal intial value is required, deafult will be undefined

2.  The input function returns a read-only Signal
3.  two different types of signal inputs we can have in Angular:
    - Optional inputs
      - default, inputs created via input() are considered optional
      - all, in this situation, the signal will have its value as undefined
    - Required inputs
      - input.required<Book>();
      - no longer provide an initial value to the input signal.
      - no longer omit the book property in the parent component
4.  **No more need for the OnChanges lifecycle hook**
    - Previously OnChanges hook was required to get notified when a component input changes.
    - We can use the effect() API to get notified whenever an input signal changes

## Setting an input property alias

we want the name of our input property to be the same as the name of the input signal.
But sometimes, we might want the input property to have a different name

        book = input<Book>(null, {
        alias: "bookInput",
        });

        book = input.required<Book>({
        alias: "bookInput",
        });

        <book [bookInput]="angularBook" />

## Input value transformation: the transform function

1.  in some rare situations where we might want to transform the input value before it is assigned to the input signal.
2.  The value of the transform property should be a pure function, with no side effects.
3.  Inside this function is where we write our value transformation logic, and we must return a value from the function.

        book = input(null, {
            transform: (value: Book | null) => {
            if (!value) return null;

                value.title += " :TRANSFORMED";

                return value;

            },
        });

        book = input.required({
            transform: (value: Book | null) => {
            if (!value) return null;

                value.title += " :TRANSFORMED";

                return value;

            },
        });

## @output() => output() signal

1.  The output() API is a direct replacement for the traditional @Output() decorator.
2.  The output function returns an OutputEmitterRef
3.                                                        deleteBook = output<Book>()
4.  The `<Book>` generic type in output`<Book>()` indicates that this output will only emit values of type Book
5.                                                 // Child component

        deleteBook = output<Book>();

        onDelete() {
            this.deleteBook.emit({
            title: "Angular Deep Dive",
            synopsis: "A deep dive into Angular core concepts",
            });
        }


        // parent component
        <book (deleteBook)="deleteBookEvent($event)" />

6.  Just like in the case of signal inputs, we can also define an alias for an output() like so:

        deleteBook = output<Book>({
            alias: "deleteBookOutput",
            });

        //The parent component will then use deleteBookOutput to listen to the output event:

        <book (deleteBookOutput)="deleteBookEvent($event)" />

### output() RxJs Interoperability using outputFromObservable()

1.  we can very easily create an output signal that emits values from an observable.
2.  We can do this by calling the outputFromObservable function:

        deleteBook = outputFromObservable<Book>(
            of({
                title: "Angular Core Deep Dive",
                synopsis: "A deep dive into the core features of Angular.",
            })
        );

### output() RxJs interoperability with outputToObservable()

1.  We can go the other way around and convert an output into an observable.
2.  We do this by calling the outputToObservable function and passing a component output to it:

        deleteBook = output<Book>();

        deleteBookObservable$ = outputToObservable(this.deleteBook);

        constructor() {
                this.deleteBookObservable$.subscribe((book: Book) => {
                console.log("Book emitted: ", book);
            });
        }

## model() API

1.  A Model input is essentially a **writeable input!**
2.  _Model inputs allow us to specify a two-way data binding contract between the parent component and the child component._
3.  With model(), not only the parent component can pass data through it to child components, but child components can also emit data back to the parent component.
4.  for 2 way binding using model() from parent `[()] banana-in-the-box concept`
5.  You can think of it as a writeable input/output signal.
6.  use case

    - For example, imagine a date picker component with a main input value.

            // Parent component
            <book [(book)]="book" />
            <button (click)="changeSynopis()">
            Change Synopsis
            </button>

            //.ts
            book = signal<Book>({
                title: "Angular Core Deep Dive",
                synopsis: "Deep dive to advanced features of Angular",
            });

            changeSynopis() {
                this.book.update((book) => {
                book.synopsis += "Updated synopis!!";
                return book;
                });
            }


            //CHILD
            <button (click)="changeTitle()">
                Change title
            </button>

            book = model<Book>();

            changeTitle() {
                this.book.update((book) => {
                if (!book) return;
                book.title = "New title";
                return book;
                });
            }

### Responding to model() changes

1.  we can also `define an event handler that will be triggered whenever a model input emits a new value`.

        // Parent
        <book [book]="book" (bookChange)="bookChangeEvent($event)"/>

        // child
        book = model<Book>();

2.  `It's just the name of the model input book, followed by the suffix Change.`
3.  Anywhere where you can apply the `[()]` syntax, you can also subscribe to the corresponding Change event.
4.  `model() Required`

        book = model.required<Book>();

### Alias for model()

        // child
        book = model<Book>(
            {
                title: "The Avengers",
                synopsis: "Loki is back to take over the world!",
            },
            {
                alias: "bookInput",
            }
        );

        //Parent
        <book [(bookInput)]="book" />

## viewChild() signal <=> @viewChild decorator

1. viewChild is a `signal-based query used to retrieve elements from the component's template`
2. These elements can be `either instances of other Angular components or just plain HTML elements`
3. viewChild signal query does the same thing as the @ViewChild decorator

### Querying plain HTML elements with viewChild()

1.  To query an element from the template, we need to assign it a template reference, using `the # syntax.`

        <div>
            <b #title>Title</b>
        </div>


        title = viewChild<ElementRef>("title");
        constructor() {
            effect(() => {
                console.log("Title: ",
                this.title()?.nativeElement);
            });
        }

2.  The viewChild signal query `returns a signal whose emitted value is the queried element itself, although wrapped in an ElementRef.`
3.  if we want `access to the result of the query`, all we have to do is to `subscribe to the title query signal` using any of the signal-based APIs like `effect() or computed()`

### What is the value returned by this signal?

1. to access the actual native HTML element, we still have to access the nativeElement property of the signal value using any of the signal-based APIs like `effect() or computed()`
2. This is because `ElementRef is a wrapper to the actual DOM element, and not the element itself`.

### Why did we use a generic parameter ElementRef?

1. we used generic parameter ``<ElementRef>` on viewChild, to indicate the type of values emitted by the query signal.
2. If we haven't done so, the signal would be considered to emit values ot type unknown, which is not what we want.

### What about AfterViewInit?

1. we didn't have to use the typical AfterViewInit lifecycle hook like we used to do when using the @ViewChild decorator.
2. we `just used a plain signal effect() or computed()` to get notified when the title element is ready which AfterViewInit used to do.

### What happens if the value of a template variable occurs more than once?

Ans => `viewChild will pick the first occurrence of the title variable`, and no error will be thrown

        <div>
            <b #title>First Title</b>
            <b #title>Second Title</b>
        </div>

        <p #title>Paragraph Title</b>

### viewChild() and Component Queries

1.  Besides plain HTML elements, we can `also query component instances` using the viewChild feature.
2.  We can query components either by using template references like before, or by using the component class itself.

        <div>
            <book #book></book>
        </div>

        bookComponent = viewChild<BookComponent>("book");

        this.bookComponent().title;
        this.bookComponent().hello();

### How does viewChild() work if the template changes?

1. The viewChild signal query `initially performs the query when the view is initialized`.
2. If at any point the `queried element is destroyed, re-rendered, or updated from the component tree, then the signal query will perform the query again to update itself to the current state of the element`.
3. If the `element is destroyed then the value of the signal query will be undefined`.
4. But when created again, the signal query will get the element from the template view again.
5. So as you can see, the `signal query refreshes itself at every change detection run`.

### Setting "read" on viewChild()

1.  By default, the viewChild() query will emit as value:

    - an `ElementRef` instance if the queried element is a plain HTML element
    - a `component instance` if the queried element is a component

2.  `"read"` configuration tells viewChild() to emit as value the ElementRef/component/directive etc of the queried element, and not the component that is linked to it.

3.  Use cases to have different behavior

    - even if the queried element is a component, we might still want to access its HTML element for some reason.
    - in the below example we queried component but trying to get HTML el

            <div>
                <book #book></book>
            </div>

            bookComponent = viewChild<ElementRef>("book");

    - the queried element might have several directives applied to it, and we might want to query them separately.

            <book #book
                matTooltip="I'm a tooltip!">
            </book>

            bookComponent = viewChild("book", {
                read: MatTooltip
            });

### Making viewChild() to be required

- `By default, viewChild() will return undefined` if the queried element is `not found in the template view`.
- we can make viewChild() make queries that should always match something in the template `using required()` view if `something is also not matched, will throw error`

        <div>
            <b #title>Title</b>
        </div>
        titleRef = viewChild.required("bold");
