// @ts-nocheck
import { Component, lazy } from 'solid-js';
import { WindowManager } from '../../src/index';

export default function App(props): any {
  let windowApi;
  return (
    <WindowManager
      loadWindow={(props) => {
        return lazy(() => import(/* @vite-ignore */ './windows/' + props.component));
      }}
      onReady={(api) => (windowApi = api)}
      options={{
        persistent: true,
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
      <p>
        <button
          type="button"
          onClick={() => {
            windowApi?.openWindow?.('AllPosts');
          }}
        >
          open All posts
        </button>
      </p>
    </WindowManager>
  );
}
