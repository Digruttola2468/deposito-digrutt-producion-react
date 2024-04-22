import axios from "axios";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const PedidosContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data.data);
};

export default function PedidosProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [index, setIndex] = useState(null);
  const [table, setTable] = useState([]);
  const [apiOriginal, setApiOriginal] = useState([]);

  const [ordenCompra, setOrdenCompra] = useState("");

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/pedidos`, userSupabase.token],
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

  const updateIsDone = (idPedido, isDone) => {
    const value = isDone ? "1" : "0";
    const update = apiOriginal.map((elem) => {
      if (idPedido == elem.id) return { ...elem, is_done: value };
      else return elem;
    });
    setTable(update);
    setApiOriginal(update);
  };

  const updateTable = (idMatriz, object) => {
    setTable(
      apiOriginal.map((elem) => {
        if (idMatriz == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
    setApiOriginal(
      apiOriginal.map((elem) => {
        if (idMatriz == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
  };

  const postTable = (object) => {
    setApiOriginal([object, ...apiOriginal]);
    setTable([object, ...apiOriginal]);
  };

  const deleteTable = (idMatriz) => {
    setTable(apiOriginal.filter((elem) => elem.id != idMatriz));
    setApiOriginal(apiOriginal.filter((elem) => elem.id != idMatriz));
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <PedidosContext.Provider
      value={{
        apiOriginal,
        table,
        setTable,
        refreshTable: mutate,
        token: userSupabase.token,
        BASE_URL,
        updateTable,
        postTable,
        deleteTable,
        getOne,
        setIndex,
        index,
        updateIsDone,
        ordenCompra, 
        setOrdenCompra
      }}
    >
      {props.children}
    </PedidosContext.Provider>
  );
}
