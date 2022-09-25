import { Component, createSignal, ErrorBoundary, Show, splitProps, Suspense } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import useWindowState from './store/useWindowState';

export const WindowControls: Component = (attrs: any) => {
  const [props, rest] = splitProps(attrs, ['component', 'props', 'attrs', 'controls', 'loadWindow', 'windowApi']);
  const [windowState, setWindowState] = createSignal({
    title: 'Loading...',
    loading: true,
  });
  const [store, actions] = useWindowState();

  const NewComponent = props?.loadWindow?.(props);
  return (
    <div
      class="window-controller-wrapper"
      style={{
        left: `${props.attrs.pos[0]}px`,
        top: `${props.attrs.pos[1]}px`,
        width: `${props.attrs.size[0]}px`,
        height: `${props.attrs.size[1]}px`,
        'z-index': 10000 - props.attrs.zIndex,
      }}
      window-key={props.attrs.key}
    >
      <div class="window-controller-header">
        <div class="window-controller-header-icon">
          <Show when={props.attrs.icon} fallback={<span class="icon-empty">{String(props?.component || ' ').charAt(0)}</span>}>
            icon
          </Show>
        </div>
        <div class="window-controller-header-title">
          <span>{windowState().title}</span>
        </div>
        <div class="window-controller-header-controls">
          <button type="button" class="window-controller-header-btn-minimize" onClick={() => {}}>
            _
          </button>
          <button type="button" class="window-controller-header-btn-maximize" onClick={() => {}}>
            ☐
          </button>
          <button type="button" class="window-controller-header-btn-close" onClick={() => props?.controls?.close()}>
            X
          </button>
        </div>
      </div>
      <Show
        when={windowState().loading}
        children={() => (
          <div class="window-controller-loader">
            <div class="window-controller-loader-bar"></div>
          </div>
        )}
      />
      <div class="window-controller-inner">
        <ErrorBoundary
          fallback={(error) => (
            <div>
              <p>Something went terribly wrong.</p>
              <p>ERROR: {error.message}</p>
            </div>
          )}
        >
          <Suspense fallback={<></>}>
            <Dynamic
              component={NewComponent}
              {...props.props}
              windowApi={props.windowApi}
              windowUpdateProps={(i) => {
                setWindowState((v) => ({ ...v, loading: false, ...i }));
              }}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
      <style>{`
        .window-controller-wrapper {
          position: absolute;
          top: 10px;
          left: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.15);
          border: 0.5px solid #ccc;
        }
        .window-controller-header {
          flex-shrink: 0;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          align-content: center;
          justify-content: center;
          background: #f1efff;
          border-bottom: 0.5px solid #ccc;
        }
        .window-controller-inner {
          flex: 1;
          overflow: hidden;
          overflow-y: auto;
        }
        .window-controller-header-icon {
          flex-shrink: 0;
          cursor: default;
        }
        .window-controller-header-icon .icon-empty {
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
          cursor: default;
        }
        .window-controller-header-title {
          flex: 1;
          cursor: default;
        }
        .window-controller-header-controls {
          flex-shrink: 0;
          padding: 10px;
          display: flex;
          flex-direction: row;
        }
        .window-controller-header-controls button {
          appearance: none;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: rgba(0, 0, 0, 0.3);
          font-family: sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          background: rgba(204, 204, 204, 1);
          border-radius: 100%;
          width: 18px;
          height: 18px;
          margin-left: 10px;
          border: none;
          outline: none;
          transition: all 150ms ease-in-out;
        }
        .window-controller-header-controls button:hover {
          color: rgba(0, 0, 0, 0.8);
          background: rgba(177, 177, 177, 1);
        }
        .window-controller-header-controls .window-controller-header-btn-close {
          background: rgba(209, 0, 0, 0.3);
        }
        .window-controller-header-controls .window-controller-header-btn-close:hover {
          background: rgba(209, 0, 0, 0.6);
        }
        .window-controller-header-controls .window-controller-header-btn-minimize {
          padding-bottom: 8px;
        }
        .window-controller-loader {
          position: relative;
        }
        .window-controller-loader-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 0%;
          box-shadow: 1px 0px 1px 1px rgba(255, 0, 0, 0.4);
          transition: all 150ms ease-in-out;
          animation: windowLoaderAnimation 1s infinite;
        }
        @keyframes windowLoaderAnimation {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};
