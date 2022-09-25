# solidjs-window-manager

Demo here: https://codesandbox.io/s/solidjs-window-based-ui-demo-kmg3ib?file=/src/App.tsx:186-508

## Install

```bash
npm install solidjs-window-manager
```

```bash
yarn add solidjs-window-manager
```

## Usage example

```js
import { Component } from "solid-js";
import { WindowManager } from 'solidjs-window-manager';

const App: Component = () => {
  let windowApi;
  return (
    <WindowManager onReady={(api) => (windowApi = api)}>
      <p>Desktop</p>
      <p>
        <button
          type="button"
          onClick={() => {
            windowApi?.openWindow?.("MyComputer", { path: "/home/user" });
          }}
        >
          open new window
        </button>
      </p>
    </WindowManager>
  );
};
```

## Roadmap:

| | |
| :-- | :--------------------- |
| ✅ | First version out 🎉🥳 |
| &#x2610; | Center windows by default |
| &#x2610; | Support minimize |
