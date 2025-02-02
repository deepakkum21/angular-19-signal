# Angular 19

## A. @let

1.  @let template variable stable [intro in v18].
2.  scoped to the current template
3.  they cannot be reassigned or accessed from parent or sibling components\

        @let userName = 'Jane Doe';
        <h1>Welcome, {{ userName }}</h1>

        <input #userInput type="text">
        @let greeting = 'Hello, ' + userInput.value;
        <p>{{ greeting }}</p>

        @let userData = userObservable$ | async;
        <div>
        	User details: {{ userData.name }}
        </div>

## B. Updated to effect()

1.  `removed allowSignalWrites flag`
2.  this flag was intended `to limit when signals could be set within effect()`, pushing developers towards using computed() for certain scenarios.

        effect(
        	() => {
        		console.log(this.users());
        	},
        	//This flag is removed in the new version
        	{ allowSignalWrites: true }
        );

## C. routerOutletData input for RouterOutlet

1.  providing a streamlined way `for parent components to send data to their child components routed through the outlet`.
2.  When routerOutletData is set, the associated data becomes accessible in child components through the `ROUTER_OUTLET_DATA token, which employs a Signal type`.

        	// Parent Component
        	<router-outlet [routerOutletData]="routerOutletData()" />

        	// Child component routed through the outlet:
        	export class ChildComponent {
        		readonly routerOutletData: Signal<MyType> = inject(ROUTER_OUTLET_DATA);
        	}

## D. Standalone by default

1. standalone: true will become the default setting for components, directives, and pipes in Angular.

==============================

# Experimental V19

## 1. linkedSignal()

    		// syntax
    		linkedSignal({
    			source: () => ({
    				key1: sourceSignal1,
    				key2: sourceSignal2,
    				....
    			}),
    			computation: (newSourceValue, previousSourceValue) => {
    				//computation logic
    				newSourceValue.sourceSignal1()
    				previousSourceValue.sourceSignal2()
    				return value // mandatory
    			}
    		})

1. it creates `writable, auto-updating signals that respond dynamically to changes in other signals`
2. can't be done using `computed signal as they create readonly signal.`
3. When needs a `new value to be calculated based on series of signals and also want it to be writable signal`
4. The `initial signal value is calculated using the 'computation’ function`, then the `linkedSignal value can be changed manually using the 'set’` method, but when the `'source’ signal value changes, the linked signal value will be recalculated again using the 'computation’ method.`

## B. resource() API

    	// syntax
    	refSignal = resource<TypeToBeReturned, {sourceSignal: Type, ....}>( {
    				request: () => {
    					sourceSignal: this.sourceSignal(),
    						......
    				},
    				loader: async ({request, abortSignal}) => {
    					// api call
    				}
    			})

1.  designed to `manage asynchronous operations using signal.`
2.  It has built-in mechanisms to `prevent race conditions, track loading state, handle errors, update the value manually, and trigger data fetching manually as needed`.
3.  Request :- but it could just as well be a computed signal consisting of multiple values
4.  Loader :- which we asynchronously download data (the function should return promise).
5.  The return signal has
    - isLoading property
    - value property
    - error property
    - reload()

## C. afterRenderEffect()

1.  handle side effects that should only occur `after the component has finished rendering`.
2.  The effect `runs after each render cycle if its dependencies change`
3.  this effect tracks specified dependencies
4.  `‘afterRender’ and ‘afterNextRender’ do not track any dependencies` and `always schedule a callback to run after the render cycle`.

        counter = signal(0);

          constructor() {
        	afterRenderEffect(() => {
        	  console.log('after render effect', this.counter());
        	})

        	afterRender(() => {
        	  console.log('after render', this.counter())
        	})
          }

5.  `the afterRender callback will be executed after each render cycle`.
6.  The afterRenderEffect callback, on the other hand, `will be executed after rendering cycles only if the value of the signal counter has changed.`

## D. Incremental Hydration

1.  To enable

        providers: [
        	provideClientHydration(
        		withIncrementalHydration()
        	),
        	...
        ]

2.  The implementation of incremental hydration is `built on top of defer block`. When we want to utilize it, we have to add new hydrate trigger to it.

        @defer (hydrate on hover) {
         <app-hydrated-cmp />
        }

3.  The following incremental hydration trigger types are supported:
    - idle,
    - interaction,
    - immediate,
    - timer(ms),
    - hover,
    - viewport,
    - never (component will stay dehydrated indefinitely),
    - when {{ condition }}
