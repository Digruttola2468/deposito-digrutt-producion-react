import axios from "axios";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

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
  const {userSupabase} = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/producion`, userSupabase.token],
    fetcherToken
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <ProducionContext.Provider
      value={{
        tableOriginal: data,
        refreshTable: mutate,
        token: userSupabase.token,
        base_url: BASE_URL,
        fetcherToken,
      }}
    >
      {props.children}
    </ProducionContext.Provider>
  );
}
