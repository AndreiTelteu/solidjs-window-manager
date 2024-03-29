# solidjs-window-manager

[![bundlejs](https://deno.bundlejs.com/badge?q=solidjs-window-manager@1.1.3&treeshake=[{+WindowManager+}])](https://bundlejs.com/?q=solidjs-window-manager%401.1.3&treeshake=%5B%7B+WindowManager+%7D%5D)

Create a windows based UI that is persistent in localStorage.

<img src="https://i.imgur.com/gA022I4.gif" />

Demo here: https://codesandbox.io/s/solidjs-window-based-ui-demo-kmg3ib?file=/src/App.tsx:186-508

## Install

```bash
npm install solidjs-window-manager
```

```bash
yarn add solidjs-window-manager
```

## Usage example

`src/App.tsx`

```jsx
import { JSX, lazy } from 'solid-js';
import { WindowManager } from 'solidjs-window-manager';

export default function App(): JSX.Element {
  let windowApi;
  return (
    <WindowManager
      loadWindow={(props) => {
        // this prop is required
        return lazy(() => import(/* @vite-ignore */ './windows/' + props.component));
      }}
      onReady={(api) => (windowApi = api)}
      options={{
        persistent: true, // this persists all opened windows with props, position and size in localstorage
      }}
    >
      <div style={{ padding: '10px' }}>
        <p style={{ color: 'white' }}>Desktop</p>
        <p>
          <button
            type="button"
            onClick={() => {
              windowApi?.openWindow?.('MyComputer', { path: '/home/user' });
            }}
          >
            open new window
          </button>
        </p>
      </div>
    </WindowManager>
  );
}
```

`src/windows/MyComputer.tsx` (you can change `windows` folder via `loadWindow` prop)

```jsx
import { JSX, onMount } from 'solid-js';

export default function MyComputer(props: any): JSX.Element {
  onMount(() => {
    // this is how you can customize window decorator
    props?.windowUpdateProps({
      title: 'My computer',
      // the first call to windowUpdateProps will hide the loading effect, unless you overwrite it like so
      loading: true, // optional. default is false
    });
    setTimeout(() => {
      props?.windowUpdateProps({
        title: 'My computer: ' + props?.path,
        loading: false, // you can change this props after a fetch, or anytime
      });
    }, 1500);
  });

  return (
    <div>
      <p>My computer:</p>
      Path: {props?.path}
    </div>
  );
}
```

## Full demo and playground

```
git clone https://github.com/AndreiTelteu/solidjs-window-manager
cd solidjs-window-manager/example
yarn install
yarn start
```

## Roadmap:

|          |                           |
| -------- | ------------------------- |
| &#x2610; | Center windows by default |
| ✅       | Create a taskbar          |
| ✅       | Add support for minimize  |
| ✅       | Support maximize          |
| &#x2610; | Context menu for taskbar  |

## Changelog:

### v1.1.3

- Migrated from rollup to [tsup-preset-solid](https://github.com/solidjs-community/tsup-preset-solid)

### v1.1.2

- Added window props for close, maximize and minimize. Made taskbar a bit smaller.

### v1.1.1

- Update dependencies

### v1.1.0

- Polyfill for event.path browser support. (Fixed error windows would not move)

### v1.0.9

- Suport for maximize and minimize with animations

### v1.0.8

- Created a taskbar with focus and close functionality
- windowState renamed to windowStore

### v1.0.6-7

- Exported windowState for external control

### v1.0.5

- Added minimum size restriction
- Save last window size and position based on component name

### v1.0.4

- Moved my state management helper in a separate package [solidjs-storex](https://www.npmjs.com/package/solidjs-storex)

### v1.0.3

- Added support for **window resizing** on every side and corner
- Added EditPost window in example project to demonstrate the persistence of the window params, and the usage of windowApi from inside another window

### v1.0.2

- Made windows load from user-code.
- Added ErrorBoundry in windows.
- Added real-life example project using Vite (list posts from a demo api, with a virtual-list plugin).

### v1.0.1

- Added preview animated gif

### v1.0.0

- First version 🎉🥳
- redux-like state based on createStore
- open and move windows
