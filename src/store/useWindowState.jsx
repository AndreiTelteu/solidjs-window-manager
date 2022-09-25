import { createStore } from 'solid-js/store';
import { DEFAULT_STATE, reducer, actions as storeActions } from './store';

let UseObject = null;

const init = (options = { persistent: true }) => {
  if (UseObject !== null) return UseObject;
  let initState = DEFAULT_STATE;
  if (options.persistent) {
    try {
      let stateString = window?.localStorage?.getItem?.('windows-state');
      stateString = JSON.parse(stateString);
      if (stateString) initState = { ...initState, ...stateString };
    } catch (e) {}
  }
  const [store, setStore] = createStore(initState);
  const actions = {};
  Object.entries(storeActions).forEach(([key, action]) => {
    actions[key] = (...attrs) => {
      reducer(store, action(...attrs), setStore);
      save(store, options);
    };
  });
  UseObject = [store, actions];
  return UseObject;
};

const save = (state, options) => {
  if (options.persistent) {
    window?.localStorage?.setItem?.('windows-state', JSON.stringify(state));
  }
  return state;
};

export default (options) => {
  return init(options);
};
