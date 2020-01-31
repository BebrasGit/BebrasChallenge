import React, { useReducer} from "react";
import axios from 'axios';

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      console.log('success, logged in');
      return { ...state, isAuthenticated: true, name:action.payload };
    case "LOGIN_FAILURE":
      {
        console.log("failure in login ");
        return { ...state, isAuthenticated: false };
      }
    case "SIGN_OUT_SUCCESS":
     {
      console.log('successfully signed out')
      return { ...state, isAuthenticated: false ,name:""};
     }
    case "Auth Error":
      {
        console.log('auth error')
        return { ...state, isAuthenticated: false };
      }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
    name: ""
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError , setOpenLink) {
  setError(false);

  setIsLoading(true);
  var resStat, token;

    axios.post("http://localhost:8000/api/login/", {loginID: login , password:password},
    {
        headers: {
        'content-type' : 'application/json'
        }
    }
  )
  .then(response => {
  resStat=response.status;
    token = response.data.token;
    console.log(response);
    console.log("resStat"+resStat);
    if (token != null) {
        console.log("in if");
        setTimeout(() => {
          localStorage.setItem('id_token', token)
          localStorage.setItem('username',login)
          setError(false)
          setIsLoading(false)
          dispatch({ type: 'LOGIN_SUCCESS' , payload:login })
          history.push('/app/dashboard')
        }, 2000);
      }
       if (resStat==200 && token==null){
        console.log('in else');
//        setError(true);
        setIsLoading(false);
        setOpenLink(true);
//        dispatch({ type: "LOGIN_FAILURE" });
//        history.push("/login");
      }
  } ).catch(error => {
  setError(true);setIsLoading(false);
  console.log(error)});

}

function signOut(dispatch, history) {

   fetch("http://localhost:8000/api/logout/", { method:"POST",    headers: {Authorization: 'Token '+localStorage.getItem('id_token')}})
  .then(response => {
    if(response.status == 204)
    {
        return {status: response.status, data: {} };
    }
    else if(response.status<500)
    {
        return response.json().then(data => {
            return {status: response.status, data: {}};
        })
    }
    else
    {
        console.log('server error');
        throw response;
    }
    }).then(response => {
        if(response.status == 204)
        {
            dispatch({ type: "SIGN_OUT_SUCCESS" });
            return response.data;
        }else if(response.status == 403 || response.status == 401)
        {
            dispatch({ type: "Auth Error" });
            throw response.data;
        }
    });

  localStorage.removeItem("id_token");
  localStorage.removeItem("username");
  history.push("/login");
}
