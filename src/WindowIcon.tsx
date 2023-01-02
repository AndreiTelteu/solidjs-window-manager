import { Component, ErrorBoundary, JSX, Show, splitProps, Suspense } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export default function WindowIcon(attrs: any): JSX.Element {
  const [props] = splitProps(attrs, ['icon', 'name']);
  return (
    <>
      <Show
        when={props.icon}
        fallback={<span class="window-manager-icon-empty">{String(props?.name || ' ').charAt(0)}</span>}
      >
        <ErrorBoundary fallback={(error) => <></>}>
          <Suspense fallback={<></>}>
            <Dynamic component={props.icon} />
          </Suspense>
        </ErrorBoundary>
      </Show>
      <style>{`
        .window-manager-icon-empty {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #5c5c5c;
          font-family: sans-serif;
          text-transform: uppercase;
          background: #ccc;
          border-radius: 100%;
          width: 18px;
          height: 18px;
          margin: 10px;
          cursor: inherit;
        }
      `}</style>
    </>
  );
}
