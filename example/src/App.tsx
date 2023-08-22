import { JSX, lazy } from 'solid-js';
import { WindowManager } from 'solidjs-window-manager';

export default function App(props: any): JSX.Element {
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
      <style>{`
        html {
          overflow: hidden;
        }
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          font-family: sans-serif;
        }
      `}</style>
    </WindowManager>
  );
}
