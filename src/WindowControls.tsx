import { JSX, createSignal, ErrorBoundary, Show, splitProps, Suspense, createEffect } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import windowStore from './store/windowStore';
import WindowIcon from './WindowIcon';

export function WindowControls(attrs: any): JSX.Element {
  const [props, rest] = splitProps(attrs, ['component', 'props', 'attrs', 'controls', 'loadWindow', 'windowApi']);
  const [store, actions] = windowStore();
  const [windowState, setWindowState] = createSignal({
    title: 'Loading...',
    loading: true,
  });
  const [isAnimating, setIsAnimating] = createSignal(false);

  createEffect(() => {
    let newState = windowState();
    const syncKeys = ['title', 'loading'];
    let shouldUpdate = false;
    let newAttrState = {};
    syncKeys.forEach((key) => {
      if (newState?.[key] !== props?.attrs?.state?.[key]) {
        shouldUpdate = true;
        newAttrState[key] = newState[key];
      }
    });
    if (shouldUpdate) {
      actions.updateWindowState(props?.attrs?.key, newAttrState);
    }
  });

  let prevAttrs = { ...props.attrs };
  let animatingTimeout;
  createEffect(() => {
    if (prevAttrs?.maximized !== props.attrs?.maximized || prevAttrs?.minimized !== props.attrs?.minimized) {
      setIsAnimating(true);
      if (animatingTimeout) {
        clearTimeout(animatingTimeout);
        animatingTimeout = null;
      }
      animatingTimeout = setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }
    prevAttrs = { ...props.attrs };
  });

  const NewComponent = props?.loadWindow?.(props);
  return (
    <div
      class={`window-controller-wrapper ${props.attrs.maximized ? 'is-maximized' : ''} ${
        props.attrs.minimized ? 'is-minimized' : ''
      } ${isAnimating() ? 'is-animating' : ''}`}
      style={{
        'z-index': 10000 - props.attrs.zIndex,
        ...(props.attrs.maximized
          ? {
              left: 0,
              top: '60px',
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }
          : {
              left: `${props.attrs.pos?.[0] || 100}px`,
              top: `${props.attrs.pos?.[1] || 100}px`,
              width: `${props.attrs.size?.[0] || 100}px`,
              height: `${props.attrs.size?.[1] || 100}px`,
            }),
        ...(props.attrs.minimized
          ? {
              transform: `translate(0, ${-(props.attrs.pos?.[1] || 100) - (props.attrs.size?.[1] || 100)}px)`,
            }
          : {
              transform: 'translate(0, 0)',
            }),
      }}
      window-key={props.attrs.key}
    >
      <div class="window-controller-resize resize-dir-n" />
      <div class="window-controller-resize resize-dir-s" />
      <div class="window-controller-resize resize-dir-e" />
      <div class="window-controller-resize resize-dir-w" />
      <div class="window-controller-resize resize-dir-nw" />
      <div class="window-controller-resize resize-dir-ne" />
      <div class="window-controller-resize resize-dir-se" />
      <div class="window-controller-resize resize-dir-sw" />

      <div class="window-controller-container">
        <div class="window-controller-header">
          <div class="window-controller-header-icon">
            <WindowIcon icon={props?.attrs?.icon} name={props?.component} />
          </div>
          <div class="window-controller-header-title">
            <span>{windowState().title}</span>
          </div>
          <div class="window-controller-header-controls">
            <button
              type="button"
              class="window-controller-header-btn-minimize"
              onClick={() => props?.controls?.minimize(true)}
            >
              _
            </button>
            <button
              type="button"
              class="window-controller-header-btn-maximize"
              onClick={() => props?.controls?.maximize(!props.attrs.maximized)}
            >
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
                close={() => props?.controls?.close()}
                minimize={(val = true) => props?.controls?.minimize(val)}
                maximize={(val = true) => props?.controls?.maximize(val)}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      <style>{`
        .window-controller-wrapper {
          position: absolute;
          top: 10px;
          left: 10px;
        }
        .window-controller-wrapper.is-animating {
          transition: all 150ms ease-in-out;
        }
        .window-controller-container {
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          background: rgba(255, 255, 255, 0.84);
          backdrop-filter: blur(5px);
          border-radius: 8px;
          box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.15);
          border: 0.5px solid #ccc;
        }
        .window-controller-wrapper.is-animating .window-controller-container {
          transition: all 150ms ease-in-out;
        }
        .window-controller-wrapper.is-maximized .window-controller-container {
          background: rgba(255, 255, 255, 1);
          border-radius: 0px;
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
        .window-controller-header-title {
          flex: 1;
          cursor: default;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
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
        .window-controller-resize {
          position: absolute;
          // box-shadow: 0px 0px 0px 1px red;
          z-index: 10;
        }
        .window-controller-resize.resize-dir-n,
        .window-controller-resize.resize-dir-s {
          left: 0;
          right: 0;
          height: 8px;
        }
        .window-controller-resize.resize-dir-n {
          top: -4px;
          cursor: n-resize;
        }
        .window-controller-resize.resize-dir-s {
          bottom: -4px;
          cursor: s-resize;
        }
        .window-controller-resize.resize-dir-w,
        .window-controller-resize.resize-dir-e {
          top: 0;
          bottom: 0;
          width: 8px;
        }
        .window-controller-resize.resize-dir-w {
          left: -4px;
          cursor: w-resize;
        }
        .window-controller-resize.resize-dir-e {
          right: -4px;
          cursor: e-resize;
        }
        .window-controller-resize.resize-dir-nw,
        .window-controller-resize.resize-dir-ne,
        .window-controller-resize.resize-dir-sw,
        .window-controller-resize.resize-dir-se {
          width: 8px;
          height: 8px;
          // box-shadow: 0px 0px 0px 1px green;
        }
        .window-controller-resize.resize-dir-nw {
          top: -4px;
          left: -4px;
          cursor: nw-resize;
        }
        .window-controller-resize.resize-dir-ne {
          top: -4px;
          right: -4px;
          cursor: ne-resize;
        }
        .window-controller-resize.resize-dir-sw {
          bottom: -4px;
          left: -4px;
          cursor: sw-resize;
        }
        .window-controller-resize.resize-dir-se {
          bottom: -4px;
          right: -4px;
          cursor: se-resize;
        }
      `}</style>
    </div>
  );
}
