import { create } from 'zustand';
import createSelectors from './createSelectors';

type initialState<T = any> = {
  user: {
    [key: string]: T;
  };
  intl: 'en' | 'zh'
};
type Action = {
  setUser: (user: initialState['user']) => void;
  setIntl: (intl: initialState['intl']) => void;
  reset: () => void;
};

const initialState: initialState = {
  user: {},
  intl: 'zh'
};
const useGlobalStore = create<initialState & Action>((set) => ({
  ...initialState,
  setUser: (user) => set(() => ({ user: user })),
  setIntl: (intl: any) => set(() => ({ intl: intl })),
  reset: () => set(() => initialState),
}));

const { getState, setState, subscribe } = useGlobalStore;
const globalStore = createSelectors(useGlobalStore);
export { globalStore, getState, setState, subscribe };
export default useGlobalStore;
