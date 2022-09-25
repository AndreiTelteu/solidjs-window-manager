# solidjs-window-manager

<img src="https://i.imgur.com/AbeTZsS.gif" />

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
import { Component } from 'solid-js';
import { WindowManager } from 'solidjs-window-manager';

export default function App(): Component {
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
      <p>Desktop</p>
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
    </WindowManager>
  );
}
```

`src/windows/MyComputer.jsx` (you can change `windows` folder via `loadWindow` prop)

```jsx
import { Component } from 'solid-js';
import { createSignal, onMount } from "solid-js";

export default function MyComputer(props: any): Component {
  onMount(() => {
    // this is how you can customize window decorator
    props?.windowUpdateProps({
      title: "My computer",
      // the first call to windowUpdateProps will hide the loading effect, unless you overwrite it like so
      loading: true // optional. default is false
    });
    setTimeout(() => {
      props?.windowUpdateProps({
        title: "My computer: " + props?.path,
        loading: false // you can change this props after a fetch, or anytime
      });
    }, 1500);
  });

  return (
    <div>
      <p>My computer:</p>
      Path: {props?.path}
    </div>
  ) as Component; // I don't know how to fix vscode typescript issue other that this ugly fix
};

```

## Full demo and playground

```
git clone https://github.com/AndreiTelteu/solidjs-window-manager
cd solidjs-window-manager/example
npm install
npm start
```

## Roadmap:

|          |                           |
| :------- | :------------------------ |
| ✅       | First version out 🎉🥳    |
| ✅       | Added a example solid app |
| &#x2610; | Center windows by default |
| &#x2610; | Support minimize          |
