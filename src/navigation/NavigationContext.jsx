import { createContext, useContext, useReducer } from 'react';
import { navReducer, initialNavState } from './navReducer.js';
import { useRemoteControl } from './useRemoteControl.js';

const NavStateContext = createContext(null);
const NavDispatchContext = createContext(null);

export function NavigationProvider({ children }) {
  const [state, dispatch] = useReducer(navReducer, initialNavState);
  useRemoteControl(state, dispatch);

  return (
    <NavDispatchContext.Provider value={dispatch}>
      <NavStateContext.Provider value={state}>{children}</NavStateContext.Provider>
    </NavDispatchContext.Provider>
  );
}

export const useNavState = () => useContext(NavStateContext);
export const useNavDispatch = () => useContext(NavDispatchContext);
