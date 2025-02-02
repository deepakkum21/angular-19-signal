# View Encapsulations

1. determines `how styles are applied to a component's template and how those styles interact with other parts` of the application
2. By default, Angular uses a `mechanism to prevent styles defined in one component from affecting other components, ensuring a level of style isolation`.
3. different view encapsulation strategies.
   - `Emulated (default)`
   - `ShadowDom`
   - `None`

## Emulated [Default]

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

## ShadowDom

1.  Behavior
    - Angular uses the `native Shadow DOM` to `encapsulate the component’s view`.
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

# :host , ::ng-deep (/deep/ and >>>)

https://blog.angular-university.io/angular-host-context/

1. `special selectors that allow you to target elements in a component’s template from its styles`.
2. These can be useful when you want to `apply styles from the component's styles to child elements or elements outside the component while respecting the Angular view encapsulation`.

## :host => target component root element / roo container <app-comp> <book> [nghost-c0]

## ::ng-deep [dep] => target component child element from parent [ngcontent-c0]

## :host ::ng-deep => target from host the project element using `<ng-content>`

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
2.  It allows styles to `"pierce" the view encapsulation, making it easier to apply styles to nested components or deeply nested elements`.
3.  ::ng-deep is `deprecated` in Angular and will eventually be removed. However, it’s still widely used as a workaround until a proper solution is provided (`usually with the new Shadow DOM approach`).

        <!-- parent.component.html -->
        <app-child></app-child>

        <!-- child.component.html -->
        <p>This is the child component</p>


        /* parent.component.css */
        ::ng-deep app-child p {
            color: red;
            font-size: 20px;
        }

4.  Explanation: The ::ng-deep selector allows you to target the `<p>` element inside the `<app-child>` component from the parent component’s styles. Without ::ng-deep, Angular's view encapsulation would prevent the parent from styling the child component directly.
