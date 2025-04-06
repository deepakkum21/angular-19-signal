# Store

## ngxs VS ngrx

| **Feature**                  | **NGXS**                                                                                               | **NgRx**                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Purpose**                  | A simpler, more lightweight state management solution for Angular.                                     | A more complex, feature-rich state management solution inspired by Redux.                             |
| **API Design**               | Provides a more Angular-friendly API, using decorators and less boilerplate.                           | Uses a more verbose, Redux-inspired API with actions, reducers, effects, and stores.                  |
| **Learning Curve**           | Easier to learn and implement, especially for Angular developers.                                      | Steeper learning curve due to its use of Redux patterns and more complex setup.                       |
| **State Management**         | Uses simple stores and state models.                                                                   | Uses actions, reducers, and selectors, along with more explicit handling of side effects.             |
| **Side Effects Management**  | Provides an easier way to manage side effects with @Action decorators and @State lifecycle hooks.      | Uses **Effects** to handle side effects, with more boilerplate and setup involved.                    |
| **Stores**                   | Stores are simple and easy to set up with `@State` decorator.                                          | Requires setting up actions, reducers, and selectors explicitly for each slice of state.              |
| **Actions**                  | Actions are defined using decorators on methods, resulting in less boilerplate.                        | Actions are separate classes, and all action types are explicitly defined.                            |
| **Reducers**                 | Reducers are handled automatically by the `@Action` decorator and don't require as much boilerplate.   | Actions trigger reducers, which update the state based on the action type. Requires more manual work. |
| **Selectors**                | Uses simple functions or selectors to access state.                                                    | Selectors are more explicit, often requiring separate files to define them.                           |
| **Community & Ecosystem**    | Smaller community, less widespread but growing.                                                        | Larger community, widely adopted, and well-integrated with other tools.                               |
| **Integration with Angular** | Highly integrated with Angular's native features like `@State`, `@Action`, and `@Selector` decorators. | Built around the Redux pattern, which is not inherently Angular-specific.                             |
| **Boilerplate**              | Less boilerplate code, especially for simple state management tasks.                                   | More boilerplate, especially for complex state management needs.                                      |
| **State Immutability**       | State is immutable but can be mutated more directly than NgRx in some cases.                           | Strict immutability is enforced using reducers and actions, following Redux principles.               |
| **Persistence/Storage**      | Built-in support for state persistence through plugins or middleware.                                  | Persistence usually requires external libraries like **ngrx-store-localstorage**.                     |
| **Development Tools**        | Less mature tooling and middleware compared to NgRx.                                                   | Robust developer tools like the NgRx Store Devtools for debugging state and actions.                  |
| **Performance**              | Lightweight and optimized for smaller applications or simple state management.                         | More suitable for large applications with complex state and side effects.                             |
| **TypeScript Support**       | Excellent TypeScript support with decorators and automatic type inference.                             | Full TypeScript support, but requires more manual type definitions (e.g., for actions, reducers).     |
| **Debugging**                | Limited debugging tools compared to NgRx.                                                              | Excellent debugging tools like the NgRx Store Devtools and integration with Redux DevTools.           |

---

## NGXS

1. `@Store`
2. `@Action`
3. `@Selector`

https://www.ngxs.io/

```ts
// counter.state.ts
import { State, Action, StateContext } from '@ngxs/store';

// Define the actions
export class Increment {
  static readonly type = '[Counter] Increment';
}

export class Decrement {
  static readonly type = '[Counter] Decrement';
}

export class IncrementByMultiple {
  static readonly type = '[Counter] IncrementByMultiple';
  constructor(public multiplePayload: number) {}
}

// Define the state model
export interface CounterStateModel {
  count: number;
}

// Create the state
@State<CounterStateModel>({
  name: 'counter',
  defaults: {
    count: 0,
  },
})
export class CounterState {
  // Selectors
  @Selector()
  static getCounter(state: CounterStateModel): number {
    return state.counter;
  }

  constructor() {}

  // Action to increment the count
  @Action(Increment, { cancelUncompleted: true })
  increment(ctx: StateContext<CounterStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      count: state.count + 1,
    });
  }

  @Action(IncrementByMultiple, { cancelUncompleted: true })
  increment(ctx: StateContext<CounterStateModel>, action: IncrementByMultiple) {
    const multipleBy = action.payload;
    const state = ctx.getState();
    ctx.setState({
      ...state,
      count: state.count * multipleBy,
    });
  }

  // Action to decrement the count
  @Action(Decrement, { cancelUncompleted: true })
  decrement(ctx: StateContext<CounterStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      count: state.count - 1,
    });
  }
}
```

```ts
export class AppComponent {
  // Select the count from the store
  count$: Observable<number> = this.store.select(CounterStateModel.getCounter); // return Observable

  countSignal: Signal<number> = this.store.selectSignal(
    CounterStateModel.getCounter
  ); // return Signal

  constructor(private store: Store) {}

  // Dispatch increment action
  increment() {
    this.store.dispatch(new Increment());
  }

  // Dispatch decrement action
  decrement() {
    this.store.dispatch(new Decrement());
  }
}
```

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideStore()],
};
```
