import axios from "axios";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const MatricesContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function MatricesContextProvider(props) {
  const {userSupabase} = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/matrices`, userSupabase.token],
    fetcherToken
  );

  const [index, setIndex] = useState();
  
  const getOne = () => {
    return data.find(elem => elem.id == index)
  }

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <MatricesContext.Provider
      value={{
        tableOriginal: data,
        refreshTable: mutate,
        token: userSupabase.token,
        base_url: BASE_URL,
        fetcherToken,
        getOne, 
        setIndex
      }}
    >
      {props.children}
    </MatricesContext.Provider>
  );
}
