import { createContext, useEffect, useReducer } from "react";

/* Defines the initial state for a Redux store. 
Sets the user property to the result of parsing the user object from local storage as JSON, or to null
if there is no user object in local storage. 
It also sets loading and error properties to false and null */
const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
};


export const AuthContext = createContext(INITIAL_STATE);
/* Handles different actions that can be dispatched to the context.
The reducer returns a new state object with updated values for the user,
loading, and error properties based on the dispatched action. */
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
        return  {
            user: null,
            loading: true,
            error: null,
        };
    case "LOGIN_SUCCESS":
        return  {
            user: action.payload,
            loading: false,
            error: null,
        };
    case "LOGIN_FAILURE":
        return  {
            user: null,
            loading: false,
            error: action.payload,
        };
    case "LOGOUT":
        return  {
            user: null,
            loading: false,
            error: null,
        };
    default:
        return state;
    }
};

// Maintains the state of the user authentication information.
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  // Stores user information to local storage whenever it changes.
  useEffect (()=>{
    console.log(state.user)
    localStorage.setItem("user", JSON.stringify(state.user))
  }, [state.user])


  /* AuthContextProvider wraps its children components. It provides the state values (user, loading, and error) 
  and the dispatch function returned from the useReducer hook as the context value. */
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};