import { StoreSetter } from 'solid-js/store';
import { defineStore } from 'solidjs-storex';

interface WindowPreferencesState {
  [key: string | number]: WindowPreferencesProps;
}
interface WindowPreferencesProps {
  pos?: [number, number];
  size?: [number, number];
}

export default defineStore({
  state: {} as WindowPreferencesState,
  options: {
    persistent: true,
    storageKey: 'windows-preferences-state',
    storageThrottle: 250,
  },
  actions: (state, set) => ({
    save: (key: string, props: StoreSetter<WindowPreferencesProps, string[]>) => {
      set(key, props);
    },
    get: (key: string) => {
      if (state.hasOwnProperty(key)) {
        return state[key]; // return does nothing now. i dont capture it. to be fixed in a future release
      }
    },
  }),
});

export function findWindowPreferences(state, key: string) {
  if (state.hasOwnProperty(key)) {
    return state[key];
  }
}
