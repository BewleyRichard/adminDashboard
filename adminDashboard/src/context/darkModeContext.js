import { createContext, useReducer } from "react";
import DarkModeReducer from "./darkModeReducer";


// Handles dark mode. The initial state of darkMode is set to false.
const INITIAL_STATE = {
  darkMode: false,
};

export const DarkModeContext = createContext(INITIAL_STATE);
// DarkModeReducer takes the current state and an action and returns the new state.
export const DarkModeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(DarkModeReducer, INITIAL_STATE);

  return (
    <DarkModeContext.Provider value={{ darkMode: state.darkMode, dispatch }}>
      {children}
    </DarkModeContext.Provider>
  );
};
