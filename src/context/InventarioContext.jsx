import axios from "axios";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const InventarioContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function InventarioContextProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [index, setIndex] = useState(null);     
  const [table, setTable] = useState([]);

  let { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/inventario`, userSupabase.token],
    fetcherToken,
    {
      onSuccess: (data, evt, config) => {
        setTable(data);
      },
    }
  );

  const getOne = () => {
    return data.find((elem) => elem.id == index);
  };

  const updateTable = (idInventario, object) => {
    data = data.map((elem) => {
      if (idInventario == elem.id) return { ...elem, ...object };
      else return elem;
    });
    console.log(data);
    setTable(data);
  };

  const postTable = (object) => {
    data.push(object);
    setTable(data);
  };

  const deleteTable = (idInventario) => {
    data = data.filter((elem) => elem.id != idInventario);
    setTable(data);
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <InventarioContext.Provider
      value={{
        api: data,
        table,
        setTable,
        refreshTable: mutate,
        token: userSupabase.token,
        base_url: BASE_URL,
        updateTable,
        postTable,
        deleteTable,
        getOne,
        setIndex,
        index,
      }}
    >
      {props.children}
    </InventarioContext.Provider>
  );
}
