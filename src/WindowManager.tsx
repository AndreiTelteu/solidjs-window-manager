import { children, Component, For, onMount, splitProps } from "solid-js";
import useWindowState from "./store/useWindowState";
import { WindowControls } from "./WindowControls";

export const WindowManager: Component = (attrs: any) => {
  const child = children(() => attrs.children);
  const [props, rest] = splitProps(attrs, ["onReady", "options"]);
  const [store, actions] = useWindowState();
  const openedWindows = () => Object.keys(store.windows);

  const openWindow = (component, props) => {
    console.log({ component, props });
    actions.openWindow(component, props);
  };

  let mainWrapper;
  const state = {
    active: false,
    start: [0, 0],
    windowStart: [0, 0],
    activeWindowKey: null,
    offset: [0, 0]
  };
  const events = {
    onMouseDown: (event) => {
      event.preventDefault();
      let foundHeader = false;
      let foundWindow = false;
      let activeWindow = null;
      event.path?.forEach((el) => {
        if (String(el?.className || "").indexOf("header") !== -1) {
          foundHeader = true;
        }
        if ((el?.attributes || {}).hasOwnProperty("window-key")) {
          foundWindow = true;
          state.activeWindowKey = el.attributes?.["window-key"]?.value;
          console.log("FOCUS window", state.activeWindowKey);
          if (store.windows.hasOwnProperty(state.activeWindowKey)) {
            activeWindow = store.windows[state.activeWindowKey];
            if (activeWindow.attrs.zIndex > 1) {
              actions.focusWindow(state.activeWindowKey);
            }
          }
        }
      });
      if (!foundHeader || !foundWindow) return;
      state.active = true;
      state.start = [event.clientX, event.clientY];
      if (activeWindow) {
        state.windowStart = activeWindow.attrs.pos;
        state.offset = [
          state.start[0] - state.windowStart[0],
          state.start[1] - state.windowStart[1]
        ];
      }
    },
    onMouseMove: (event) => {
      event.preventDefault();
      if (!state.active) return;
      actions.moveWindow(state.activeWindowKey, [
        event.clientX - state.offset[0],
        event.clientY - state.offset[1]
      ]);
    },
    onMouseUp: (event) => {
      event.preventDefault();
      if (!state.active) return;
      state.active = false;
      state.windowStart = [0, 0];
      state.activeWindowKey = null;
      state.offset = [0, 0];
    }
  };

  onMount(() => {
    props?.onReady?.({
      openWindow
    });
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
              controls={{
                close: () => actions.closeWindow(windowProps?.attrs?.key)
              }}
            />
          );
        }}
      />
      <style>{`
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
};
