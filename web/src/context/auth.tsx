import { createContext, ReactNode, useState } from "react";
import { Token } from "../api/RMA.Service";

interface AuthProviderProps {
  children: ReactNode;
}

export interface User {
    id:number;
  username: string;
  password: string;
  email: string;
  role: string;
}

export type AccessToken = {
    access_token: string;
    token_type: string;
}

type TypExContextType = {
  user: User;
  token: AccessToken;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setToken: React.Dispatch<React.SetStateAction<AccessToken>>;

};

export const userContextState = {
  user: { username: "", email: "", password: "", role: "", id:0 },
  token: { access_token: "", token_type: ""},
  setUser: () => {},
  setToken: () => { } 
} 

export const UserContext = createContext<TypExContextType>(userContextState);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(userContextState.user);
  const [ token, setToken ] = useState<AccessToken>(userContextState.token)

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      { children }
    </UserContext.Provider>
  );
}
