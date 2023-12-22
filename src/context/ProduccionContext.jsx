import axios from "axios";
import { createContext } from "react";
import useSWR from "swr";

export const ProducionContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function ProduccionContextProvider(props) {
  const TOKEN = "";
  const BASE_URL = "";

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/producion`, TOKEN],
    fetcherToken
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <ProducionContext.Provider
      value={{
        tableOriginal: data,
        refreshTable: mutate,
        token: TOKEN,
        base_url: BASE_URL,
        fetcherToken,
      }}
    >
      {props.children}
    </ProducionContext.Provider>
  );
}
