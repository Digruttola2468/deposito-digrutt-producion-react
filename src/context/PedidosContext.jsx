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
    .then((result) => result.data);
};

export default function PedidosProvider(props) {
  const { userSupabase } = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  let { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/pedidos`, userSupabase.token],
    fetcherToken
  );

  const [index, setIndex] = useState();

  const getOne = () => {
    return data.find((elem) => elem.id == index);
  };

  const updateIsDone = (idPedido, isDone) => {
    const value = isDone ? "1" : "0";
    data = data.map((elem) => {
      if (idPedido == elem.id) return { ...elem, is_done: value };
      else return elem;
    });
    return data;
  };

  const updateTable = (idPedido, object) => {
    data = data.map((elem) => {
      if (idPedido == elem.id) return { ...elem, object };
      else return elem;
    });

    return data;
  };

  const postTable = (object) => {
    data.push(object);
    return data;
  };

  const deleteTable = (idPedido) => {
    data = data.filter((elem) => elem.id != idPedido);
    return data;
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <PedidosContext.Provider
      value={{
        tableOriginal: data,
        refreshTable: mutate,
        token: userSupabase.token,
        base_url: BASE_URL,
        fetcherToken,
        updateIsDone,
        updateTable,
        postItemTable: postTable,
        deleteItemTable: deleteTable,
        getOne,
        setIndex,
      }}
    >
      {props.children}
    </PedidosContext.Provider>
  );
}
