import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AccessToken,
  User,
  UserContext,
  userContextState,
} from "./context/auth";
import Button from "./components/Button";

function App() {
  const [user, setUser] = useState<User>(userContextState.user);
  const [token, setToken] = useState<AccessToken>(userContextState.token);

  const navigate = useNavigate();

  const goToLogin = () => navigate(`/login`);
  const gotToDashboard = () => navigate("/dashboard");
  const gotToRma = () => navigate("/rma");

   const logOut = () => {
    localStorage.setItem('me', "")
    localStorage.setItem('token', "")


    setToken(userContextState.token)
    setUser(userContextState.user)
    navigate('/')
    window.location.reload()
  }

  useEffect(() => {
    if (!user.id || token.access_token) {
      const localUser = localStorage.getItem("me");
      const localToken = localStorage.getItem("token");

      if (localToken && localUser) {
        const parsedUser = JSON.parse(localUser) as User;
        const parsedToken = JSON.parse(localToken) as AccessToken;

        setToken(parsedToken);
        setUser(parsedUser);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      <div className="App text-white h-full  flex flex-col ">
        <h1 className="text-[3rem] font-serif border-b-[1px] font-bold">
          TecnoEletro - Sistema RMA
        </h1>
        {user.username && <h3>Seja bem vindo(a), {user.username}</h3>}
        <div className="flex gap mt-2 justify-center gap-4 ">
          <Button text={user.id ? "Logout" : "Login"} onClickBtn={user.id ? logOut :goToLogin } />
          {user.role == "manager" && (
            <Button text="Dashboard" onClickBtn={gotToDashboard} />
          )}
          {user.role == "employee" && (
            <Button text="RMA" onClickBtn={gotToRma} />
          )}
        </div>
        <div className="    flex flex-col justify-center ">
          <Outlet />
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;

