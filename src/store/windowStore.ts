import { produce } from 'solid-js/store';
import { defineStore } from 'solidjs-storex';
import windowPreferencesStore, { findWindowPreferences } from './windowPreferencesStore';

type WindowStore = {
  windows: WindowsObject;
};
interface WindowsObject {
  [key: string | number]: WindowProps;
}
interface WindowProps {
  component: string;
  props: any;
  attrs: WindowAttrs;
}
interface WindowState {
  [key: string]: any;
}
interface WindowAttrs {
  maximized: boolean;
  minimized: boolean;
  pos: [number, number];
  size: [number, number];
  zIndex: number;
  icon?: null | string;
  key: string;
  state: WindowState;
}

const [windowPreferencesState, { save: saveWindowPreferences }] = windowPreferencesStore();

export default defineStore({
  state: {
    windows: {},
  } as WindowStore,
  options: {
    persistent: true,
    storageKey: 'windows-state',
    storageThrottle: 250,
  },
  actions: (state, set) => ({
    openWindow: (component, props) => {
      Object.keys(state?.windows || {}).forEach((item) => {
        if (state.windows[item].attrs.minimized == false) {
          set('windows', item, 'attrs', 'zIndex', (i) => ++i);
        }
      });
      let key = generateWindowKey({ component, props });
      set('windows', key, {
        component,
        props,
        attrs: { ...getDefaultWindowsAttrs({ component, props }), key } as WindowAttrs,
      } as WindowProps);
    },
    closeWindow: (key) => {
      set(
        produce((state: WindowStore) => {
          if (state?.windows?.hasOwnProperty(key)) {
            delete state.windows[key];
          }
        }),
      );
    },
    moveWindow: (key, pos) => {
      set('windows', key, 'attrs', 'pos', pos);
      saveWindowPreferences(state.windows[key].component, (attrs) => ({ ...attrs, pos: state.windows[key].attrs.pos }));
    },
    resizeWindow: (key, size) => {
      const minWidth = 300;
      const minHeight = 300;
      set('windows', key, 'attrs', 'size', (currentSize) => {
        let newSize = [...size(currentSize)];
        return [
          newSize[0] < minWidth ? minWidth : newSize[0],
          newSize[1] < minHeight ? minHeight : newSize[1],
        ] satisfies [number, number];
      });
      saveWindowPreferences(state.windows[key].component, (attrs) => ({
        ...attrs,
        size: state.windows[key].attrs.size,
      }));
    },
    focusWindow: (key) => {
      Object.keys(state?.windows || {}).forEach((item) => {
        if (state.windows[item].attrs.minimized == false) {
          set('windows', item, 'attrs', 'zIndex', (i) => ++i);
        }
      });
      set('windows', key, 'attrs', 'minimized', false);
      set('windows', key, 'attrs', 'zIndex', 1);
    },
    updateWindowState: (key, newState) => {
      set('windows', key, 'attrs', 'state', (s) => {
        return { ...s, ...newState };
      });
    },
    maximizeWindow: (key, maximized) => {
      set('windows', key, 'attrs', 'maximized', maximized);
    },
    minimizeWindow: (key, minimized) => {
      set('windows', key, 'attrs', 'minimized', minimized);
      if (minimized == true) {
        set('windows', key, 'attrs', 'zIndex', 0);
        Object.keys(state?.windows || {}).forEach((item) => {
          if (state.windows[item].attrs.minimized == false) {
            set('windows', item, 'attrs', 'zIndex', (i) => (i > 1 ? --i : i));
          }
        });
      }
    },
  }),
});

const getDefaultWindowsAttrs = (props): WindowAttrs => {
  const defaultAttrs: WindowAttrs = {
    maximized: false,
    minimized: false,
    // TODO: calculate center of window minus half window size
    // pos: [window.innerWidth / 2 || 200, window.innerHeight / 2 || 200],
    pos: [200, 200],
    size: [500, 400],
    zIndex: 1,
    icon: null,
    key: '',
    state: { title: '', loading: true },
  };
  if (props.component) {
    let preferences = findWindowPreferences(windowPreferencesState, props.component);
    if (preferences) {
      if (preferences.pos) defaultAttrs.pos = preferences.pos;
      if (preferences.size) defaultAttrs.size = preferences.size;
    }
  }
  return defaultAttrs;
};

const generateWindowKey = (props) => {
  return new Array(15).join().replace(/(.|$)/g, function () {
    return ((Math.random() * 36) | 0).toString(36)[Math.random() < 0.5 ? 'toString' : 'toUpperCase']();
  });
};
