import { Component, For } from 'solid-js';
import windowStore from './store/windowStore';
import WindowIcon from './WindowIcon';

const Taskbar: Component = (props) => {
  const [store, actions] = windowStore();
  const openedWindows = () => Object.keys(store.windows);
  const isFocused = (item) => item?.attrs?.zIndex == 1;
  return (
    <>
      <div class="window-manager-taskbar-placeholder"></div>
      <div class="window-manager-taskbar">
        <div class="window-manager-taskbar-wrapper">
          <For each={openedWindows()}>
            {(item, index) => {
              const windowProps = store.windows[item];
              return (
                <div
                  class={`${'window-manager-taskbar-item'} ${isFocused(windowProps) ? 'is-active' : ''}`}
                  onClick={() => {
                    if (isFocused(windowProps)) {
                      actions.minimizeWindow(windowProps?.attrs?.key, true);
                    } else {
                      actions.focusWindow(windowProps?.attrs?.key);
                    }
                  }}
                >
                  <div class="window-manager-taskbar-icon">
                    <WindowIcon icon={windowProps?.attrs?.icon} name={windowProps?.component} />
                  </div>
                  <div class="window-manager-taskbar-name">
                    {windowProps?.attrs?.state?.title || windowProps?.component || ''}
                  </div>
                  <button
                    class="window-manager-taskbar-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.closeWindow(windowProps?.attrs?.key);
                    }}
                  >
                    X
                  </button>
                </div>
              );
            }}
          </For>
        </div>
      </div>
      <style>{`
        .window-manager-taskbar-placeholder {
          width: 100%;
          height: 50px;
        }
        .window-manager-taskbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 50px;
          z-index: 100;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(5px);
          padding: 7px 10px;
        }
        .window-manager-taskbar-wrapper {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: stretch;
          height: 100%;
          gap: 10px;
        }
        .window-manager-taskbar-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 36px;
          width: 200px;
          border-radius: 6px;
          cursor: pointer;
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          transition: all 150ms ease-in-out;
        }
        .window-manager-taskbar-item:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.6);
        }
        .window-manager-taskbar-item.is-active {
          background: rgba(255, 255, 255, 0.6);
        }
        .window-manager-taskbar-icon {
          flex-shrink: 0;
        }
        .window-manager-taskbar-name {
          flex-grow: 1;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 0.9rem;
          word-break: break-all;
          white-space: nowrap;
        }
        .window-manager-taskbar-btn {
          flex-shrink: 0;
          margin: 10px;
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
          border: none;
          outline: none;
          transition: all 150ms ease-in-out;
        }
        .window-manager-taskbar-btn:hover {
          color: rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </>
  );
};
export default Taskbar;
