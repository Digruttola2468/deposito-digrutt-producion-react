import axios from "axios";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const PostMatricesContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function PostMatricesContextProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [table, setTable] = useState([]);
  const [apiOriginal, setApiOriginal] = useState([]);
  const [listMatrices, setListMatrices] = useState([]);
  const [cliente, setCliente] = useState("");


  const { isLoading, error } = useSWR(
    [`${BASE_URL}/matrices`, userSupabase.token],
    fetcherToken,
    {
      onSuccess: (data, evt, config) => {
        setTable(data);
        setApiOriginal(data);
      },
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <PostMatricesContext.Provider
      value={{
        apiOriginal,
        table,
        setTable,
        listMatrices,
        setListMatrices,
        cliente, 
        setCliente
      }}
    >
      {props.children}
    </PostMatricesContext.Provider>
  );
}
