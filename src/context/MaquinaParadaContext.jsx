import axios from "axios";
import { createContext } from "react";
import useSWR from "swr";

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
  const TOKEN = import.meta.env.VITE_TOKEN;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/maquinaParada`, TOKEN],
    fetcherToken
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <MaquinaParadaContext.Provider
      value={{
        tableOriginal: data,
        refreshTable: mutate,
        token: TOKEN,
        base_url: BASE_URL,
        fetcherToken,
      }}
    >
      {props.children}
    </MaquinaParadaContext.Provider>
  );
}
