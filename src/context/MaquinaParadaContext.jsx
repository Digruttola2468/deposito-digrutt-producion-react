import axios from "axios";
import { createContext, useContext } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const MaquinaParadaContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function MaquinaParadaProvider(props) {
  const {userSupabase} = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/maquinaParada`, userSupabase.token],
    fetcherToken
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <MaquinaParadaContext.Provider
      value={{
        tableOriginal: data,
        refreshTable: mutate,
        token: userSupabase.token,
        base_url: BASE_URL,
        fetcherToken,
      }}
    >
      {props.children}
    </MaquinaParadaContext.Provider>
  );
}
