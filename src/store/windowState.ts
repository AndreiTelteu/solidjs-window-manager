import { produce } from 'solid-js/store';
import { defineStore } from 'solidjs-storex';

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

export default defineStore({
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
    },
    resizeWindow: (key, size) => {
      set('windows', key, 'attrs', 'size', size);
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
  // TODO: get last window pos based on comp name
  return {
    minimized: false,
    // pos: [window.innerWidth / 2 || 200, window.innerHeight / 2 || 200],
    pos: [200, 200],
    size: [400, 400],
    zIndex: 1,
    icon: null,
    key: '',
  };
};

const generateWindowKey = (props) => {
  return new Array(15).join().replace(/(.|$)/g, function () {
    return ((Math.random() * 36) | 0).toString(36)[Math.random() < 0.5 ? 'toString' : 'toUpperCase']();
  });
};
