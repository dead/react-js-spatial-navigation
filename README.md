# react-js-spatial-navigation
A wrapper of js-spatial-navigation to react components

## Example
```javascript
import React from 'react';
import { render } from 'react-dom';
import SpatialNavigation, { Focusable, FocusableSection } from 'react-js-spatial-navigation'

function focus1() {
  console.log('focused 1')
}

function unfocus2() {
  console.log('unfocus 2')
}

const App = () => (
  <SpatialNavigation>
    <Focusable onFocus={focus1}>
      <p>Element 1</p>
    </Focusable>
    <Focusable onUnfocus={unfocus2}>
      <p>Element 2</p>
    </Focusable>

    <FocusableSection defaultElement="active">
      <Focusable>
        <p>Element 3</p>
      </Focusable>
      <Focusable className="active">
        <p>Element 4</p>
      </Focusable>
    </FocusableSection>
  </SpatialNavigation>
);

render(<App />, document.getElementById('root'));
```
[Live Example](https://codesandbox.io/s/ryn6450wrn)

## Documentation

### `<SpatialNavigation>`
This component initialize the Spatial Navigation library.
It should be used only one time and in the root node of the application.
The spatial navigation will only work within the Focusable components.

### `<Focusable>`
A Focusable component that handle the onFocus, onUnfocus, onClickEnter events.
```
Props:
   onFocus: (optional)
     A function that will be fired when the component is focused.

   onUnfocus: (optional)
     A function that will be fired when the component is unfocused.

   onClickEnter: (optional)
     A function that will be fired when the component is focused and enter key is pressed.
```

### `<FocusableSection>`
A Focusable Section can specify a behaviour before focusing an element.
I.e. selecting a default element, the first element or an active one.

```
Props:
   defaultElement: (default: '')
     The default element that will be focused when entering this section.
     This can be:
       * a valid selector string for "querySelectorAll".
       * a NodeList or an array containing DOM elements.
       * a single DOM element.
       * an empty string.

   enterTo: (default: 'default-element')
     If the focus comes from another section, you can define which element in this section should be focused first.
     This can be:
       * 'last-focused' indicates the last focused element before we left this section last time. If this section has never been focused yet, the default element (if any) will be chosen next.
       * 'default-element' indicates the element defined in defaultElement.
       * an empty string.
```
