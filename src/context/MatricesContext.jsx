import { createContext, useContext, useState } from "react";
import { UserContext } from "./UserContext";

export const MatricesContext = createContext();

export default function MatricesContextProvider(props) {
  const {userSupabase} = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [apiOne, setApiOne] = useState();
  
  return (
    <MatricesContext.Provider
      value={{
        token: userSupabase.token,
        base_url: BASE_URL,
        setApiOne,
        apiOne
      }}
    >
      {props.children}
    </MatricesContext.Provider>
  );
}
