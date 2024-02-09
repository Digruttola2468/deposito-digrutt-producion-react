import axios from "axios";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const ClientesContext = createContext();

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data);
};

export default function ClientesProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [index, setIndex] = useState(null);
  const [table, setTable] = useState([]);

  let { data, isLoading, error, mutate } = useSWR(
    `${BASE_URL}/clientes`,
    fetcher,
    {
      onSuccess: (data, dsevf, config) => {
        setTable(data);
      },
    }
  );

  const refreshTable = () => {
    setTable(data);
  }

  const getOne = () => {
    return data.find((elem) => elem.id == index);
  };

  const updateTable = (idInventario, object) => {
    data = data.map((elem) => {
      if (idInventario == elem.id) return { ...elem, ...object };
      else return elem;
    });
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
    <ClientesContext.Provider
      value={{
        api: data,
        table,
        setTable,
        refreshTable,
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
    </ClientesContext.Provider>
  );
}
