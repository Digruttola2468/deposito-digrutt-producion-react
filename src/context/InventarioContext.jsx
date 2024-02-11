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
  const [apiOriginal, setApiOriginal] = useState([]);

  const [descripcion, setDescripcion] = useState("");
  const [cliente, setCliente] = useState("");

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/inventario`, userSupabase.token],
    fetcherToken,
    {
      onSuccess: (data, evt, config) => {
        setTable(data);
        setApiOriginal(data);
      },
    }
  );

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
    <InventarioContext.Provider
      value={{
        api: apiOriginal,
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
        descripcion, 
        setDescripcion,
        cliente, 
        setCliente
      }}
    >
      {props.children}
    </InventarioContext.Provider>
  );
}
