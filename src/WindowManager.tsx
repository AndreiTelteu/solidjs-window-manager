import { children, JSX, For, onMount, splitProps } from 'solid-js';
import windowState from './store/windowState';
import { WindowControls } from './WindowControls';

export function WindowManager(attrs: any): JSX.Element {
  const child = children(() => attrs.children);
  const [props, rest] = splitProps(attrs, ['onReady', 'loadWindow', 'options']);
  const [store, actions] = windowState();
  const openedWindows = () => Object.keys(store.windows);

  const openWindow = (component, props = {}) => {
    actions.openWindow(component, props);
  };

  let mainWrapper;
  const state = {
    active: false,
    start: [0, 0],
    windowStart: [0, 0],
    windowSize: [0, 0],
    activeWindowKey: null,
    moveAction: null,
    resizeDir: null,
    offset: [0, 0],
  };
  const events = {
    onMouseDown: (event) => {
      let foundHeader = false;
      let foundResize: boolean | string = false;
      let foundWindow = false;
      let activeWindow = null;
      event.path?.forEach((el) => {
        const className = String(el?.className || '');
        if (className.indexOf('window-controller-header') !== -1) {
          foundHeader = true;
        }
        if (className.indexOf('window-controller-resize') !== -1) {
          foundResize = true;
          if (className.indexOf('resize-dir-n') !== -1) foundResize = 'n';
          if (className.indexOf('resize-dir-s') !== -1) foundResize = 's';
          if (className.indexOf('resize-dir-e') !== -1) foundResize = 'e';
          if (className.indexOf('resize-dir-w') !== -1) foundResize = 'w';
          if (className.indexOf('resize-dir-nw') !== -1) foundResize = 'nw';
          if (className.indexOf('resize-dir-ne') !== -1) foundResize = 'ne';
          if (className.indexOf('resize-dir-se') !== -1) foundResize = 'se';
          if (className.indexOf('resize-dir-sw') !== -1) foundResize = 'sw';
        }
        if ((el?.attributes || {}).hasOwnProperty('window-key')) {
          foundWindow = true;
          state.activeWindowKey = el.attributes?.['window-key']?.value;
          if (store.windows.hasOwnProperty(state.activeWindowKey)) {
            activeWindow = store.windows[state.activeWindowKey];
            if (activeWindow.attrs.zIndex > 1) {
              actions.focusWindow(state.activeWindowKey);
            }
          }
        }
      });
      if (!foundWindow || (!foundHeader && !foundResize)) return;
      event.preventDefault();
      event.stopPropagation();
      state.active = true;
      state.start = [event.clientX, event.clientY];
      if (foundHeader) state.moveAction = 'move';
      if (foundResize != false) {
        state.moveAction = 'resize';
        state.resizeDir = foundResize;
      }
      if (activeWindow) {
        state.windowStart = activeWindow.attrs.pos;
        state.windowSize = activeWindow.attrs.size || [100, 100];
        state.offset = [state.start[0] - state.windowStart[0], state.start[1] - state.windowStart[1]];
      }
    },
    onMouseMove: (event) => {
      if (!state.active) return;
      event.preventDefault();
      event.stopPropagation();
      if (state.moveAction == 'move') {
        actions.moveWindow(state.activeWindowKey, [event.clientX - state.offset[0], event.clientY - state.offset[1]]);
      }
      if (state.moveAction == 'resize') {
        let diff = [event.clientX - state.start[0], event.clientY - state.start[1]];
        switch (state.resizeDir) {
          case 'n':
            actions.resizeWindow(state.activeWindowKey, (size) => [size?.[0], state.windowSize[1] - diff[1]]);
            actions.moveWindow(state.activeWindowKey, (pos) => [pos?.[0], state.windowStart[1] + diff[1]]);
            break;
          case 'ne':
            actions.resizeWindow(state.activeWindowKey, (size) => [
              state.windowSize[0] + diff[0],
              state.windowSize[1] - diff[1],
            ]);
            actions.moveWindow(state.activeWindowKey, (pos) => [pos?.[0], state.windowStart[1] + diff[1]]);
            break;
          case 'nw':
            actions.resizeWindow(state.activeWindowKey, (size) => [
              state.windowSize[0] - diff[0],
              state.windowSize[1] - diff[1],
            ]);
            actions.moveWindow(state.activeWindowKey, (pos) => [
              state.windowStart[0] + diff[0],
              state.windowStart[1] + diff[1],
            ]);
            break;
          case 's':
            actions.resizeWindow(state.activeWindowKey, (size) => [size?.[0], state.windowSize[1] + diff[1]]);
            break;
          case 'se':
            actions.resizeWindow(state.activeWindowKey, (size) => [
              state.windowSize[0] + diff[0],
              state.windowSize[1] + diff[1],
            ]);
            break;
          case 'sw':
            actions.resizeWindow(state.activeWindowKey, (size) => [
              state.windowSize[0] - diff[0],
              state.windowSize[1] + diff[1],
            ]);
            actions.moveWindow(state.activeWindowKey, (pos) => [state.windowStart[0] + diff[0], pos?.[1]]);
            break;
          case 'e':
            actions.resizeWindow(state.activeWindowKey, (size) => [state.windowSize[0] + diff[0], size?.[1]]);
            break;
          case 'w':
            actions.resizeWindow(state.activeWindowKey, (size) => [state.windowSize[0] - diff[0], size?.[1]]);
            actions.moveWindow(state.activeWindowKey, (pos) => [state.windowStart[0] + diff[0], pos?.[1]]);
            break;
          default:
            break;
        }
      }
    },
    onMouseUp: (event) => {
      if (!state.active) return;
      event.preventDefault();
      event.stopPropagation();
      state.active = false;
      state.start = [0, 0];
      state.windowStart = [0, 0];
      state.windowSize = [0, 0];
      state.activeWindowKey = null;
      state.moveAction = null;
      state.resizeDir = null;
      state.offset = [0, 0];
    },
  };

  const windowApi = {
    openWindow,
  };

  onMount(() => {
    props?.onReady?.(windowApi);
  });

  return (
    <div class="window-manager-wrapper" ref={mainWrapper} {...events}>
      {child()}
      <For
        each={openedWindows()}
        children={(item, index) => {
          const windowProps = store.windows[item];
          return (
            <WindowControls
              {...windowProps}
              loadWindow={props.loadWindow}
              windowApi={windowApi}
              controls={{
                close: () => actions.closeWindow(windowProps?.attrs?.key),
              }}
            />
          );
        }}
      />
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
        .window-manager-wrapper {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
        .window-manager-wrapper::before {
          content:'';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url(https://random.imagecdn.app/1920/1080?blur=6) no-repeat;
          background-size: cover;
          background-position: center center;
          z-index: -1;
          opacity: 1;
          filter: blur(4px);
          transform: scale(1.04);
        }
        .window-manager-wrapper::after {
          content:'';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: black;
          z-index: -1;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
