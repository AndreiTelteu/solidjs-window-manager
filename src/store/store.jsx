import { produce } from 'solid-js/store';
export const DEFAULT_STATE = {
  windows: {},
};

const getDefaultWindowsAttrs = (props) => {
  // TODO: get last window pos based on comp name
  return {
    minimized: false,
    // pos: [window.innerWidth / 2 || 200, window.innerHeight / 2 || 200],
    pos: [200, 200],
    size: [400, 400],
    zIndex: 1,
    icon: null,
  };
};
const generateWindowKey = (props) => {
  return new Array(15).join().replace(/(.|$)/g, function () {
    return ((Math.random() * 36) | 0).toString(36)[Math.random() < 0.5 ? 'toString' : 'toUpperCase']();
  });
};

export const actions = {
  openWindow: (component, props) => ({ type: 'OPEN_WINDOW', component, props }),
  closeWindow: (key) => ({ type: 'CLOSE_WINDOW', key }),
  moveWindow: (key, pos) => ({ type: 'MOVE_WINDOW', key, pos }),
  focusWindow: (key) => ({ type: 'FOCUS_WINDOW', key }),
};

export const reducer = (state = DEFAULT_STATE, action, set) => {
  switch (action.type) {
    case 'OPEN_WINDOW':
      Object.keys(state?.windows || {}).forEach((item) => {
        set('windows', item, 'attrs', 'zIndex', (i) => ++i);
      });
      let key = generateWindowKey(action);
      set('windows', key, {
        component: action.component,
        props: action.props,
        attrs: { ...getDefaultWindowsAttrs(action), key },
      });
      return null;
    case 'CLOSE_WINDOW':
      set(
        produce((state) => {
          if ((state?.windows || {})?.hasOwnProperty(action.key)) {
            delete state.windows[action.key];
          }
          console.log('DELETE', JSON.stringify(state?.windows));
        }),
      );
      return null;
    case 'MOVE_WINDOW':
      set('windows', action.key, 'attrs', 'pos', action.pos);
      return null;
    case 'FOCUS_WINDOW':
      Object.keys(state?.windows || {}).forEach((item) => {
        set('windows', item, 'attrs', 'zIndex', (i) => ++i);
      });
      set('windows', action.key, 'attrs', 'zIndex', 1);
      return null;
    default:
      return state;
  }
};
