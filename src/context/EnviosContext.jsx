import axios from "axios";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const EnviosContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function EnviosContextProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [index, setIndex] = useState();
  const [table, setTable] = useState([]);

  let { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/envios`, userSupabase.token],
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
    <EnviosContext.Provider
      value={{
        api: data,
        table,
        refreshTable: mutate,
        token: userSupabase.token,
        base_url: BASE_URL,
        updateIsDone,
        updateTable,
        postTable,
        deleteTable,
        getOne,
        setIndex,
        index,
      }}
    >
      {props.children}
    </EnviosContext.Provider>
  );
}
