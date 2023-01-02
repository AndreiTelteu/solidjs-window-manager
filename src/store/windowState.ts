import { produce } from 'solid-js/store';
import { defineStore } from 'solidjs-storex';
import windowPreferencesStore, { findWindowPreferences } from './windowPreferencesStore';

type WindowState = {
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
interface WindowAttrs {
  minimized: boolean;
  pos: [number, number];
  size: [number, number];
  zIndex: number;
  icon?: null | string;
  key: string;
}

const [windowPreferencesState, { save: saveWindowPreferences }] = windowPreferencesStore();

const initStore = defineStore({
  state: {
    windows: {},
  } as WindowState,
  options: {
    persistance: true,
    storageKey: 'windows-state',
    storageThrottle: 250,
  },
  actions: (state, set) => ({
    openWindow: (component, props) => {
      Object.keys(state?.windows || {}).forEach((item) => {
        set('windows', item, 'attrs', 'zIndex', (i) => ++i);
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
        produce((state: WindowState) => {
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
        return [newSize[0] < minWidth ? minWidth : newSize[0], newSize[1] < minHeight ? minHeight : newSize[1]];
      });
      saveWindowPreferences(state.windows[key].component, (attrs) => ({
        ...attrs,
        size: state.windows[key].attrs.size,
      }));
    },
    focusWindow: (key) => {
      Object.keys(state?.windows || {}).forEach((item) => {
        set('windows', item, 'attrs', 'zIndex', (i) => ++i);
      });
      set('windows', key, 'attrs', 'zIndex', 1);
    },
  }),
});

const getDefaultWindowsAttrs = (props): WindowAttrs => {
  const defaultAttrs: WindowAttrs = {
    minimized: false,
    // TODO: calculate center of window minus half window size
    // pos: [window.innerWidth / 2 || 200, window.innerHeight / 2 || 200],
    pos: [200, 200],
    size: [500, 400],
    zIndex: 1,
    icon: null,
    key: '',
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

const store = initStore();

export default () => store;
