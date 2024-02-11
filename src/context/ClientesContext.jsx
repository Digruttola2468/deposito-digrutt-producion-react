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
  const [apiOriginal, setApiOriginal] = useState([]);

  const [descripcion, setDescripcion] = useState("");
  const [localidad, setLocalidad ] = useState("");

  const { data, isLoading, error, mutate } = useSWR(
    `${BASE_URL}/clientes`,
    fetcher,
    {
      onSuccess: (data, dsevf, config) => {
        setTable(data);
        setApiOriginal(data);
      },
    }
  );

  const refreshTable = () => {
    setDescripcion("");
    setTable(data);
    setApiOriginal(data);
  };

  const getOne = () => {
    return apiOriginal.find((elem) => elem.id == index);
  };

  const updateTable = (idInventario, object) => {
    const update = apiOriginal.map((elem) => {
      if (idInventario == elem.id) return { ...elem, ...object };
      else return elem;
    });
    setTable(update);
    setApiOriginal(update);
  };

  const postTable = (object) => {
    setTable([object, ...apiOriginal]);
    setApiOriginal([object, ...apiOriginal]);
  };

  const deleteTable = (idInventario) => {
    setTable(apiOriginal.filter((elem) => elem.id != idInventario));
    setApiOriginal(apiOriginal.filter((elem) => elem.id != idInventario));
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <ClientesContext.Provider
      value={{
        api: apiOriginal,
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
        descripcion, 
        setDescripcion,
        localidad, 
        setLocalidad
      }}
    >
      {props.children}
    </ClientesContext.Provider>
  );
}
