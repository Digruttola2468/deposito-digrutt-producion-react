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
    .then((result) => result.data.data);
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

  const updateTable = (idPedido, object) => {
    data = data.map((elem) => {
      if (idPedido == elem.id) return { ...elem, object };
      else return elem;
    });
    setTable(data);
    mutate();
  };

  const postTable = (object) => {
    data.push(object);
    setTable(data);
    mutate();
  };

  const deleteTable = (idPedido) => {
    data = data.filter((elem) => elem.id != idPedido);
    setTable(data);
    mutate();
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <EnviosContext.Provider
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
    </EnviosContext.Provider>
  );
}
