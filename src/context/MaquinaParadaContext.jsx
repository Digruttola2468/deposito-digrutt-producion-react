import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const MaquinaParadaContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function MaquinaParadaProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [index, setIndex] = useState(null);
  const [table, setTable] = useState([]);
  const [apiOriginal, setApiOriginal] = useState([]);

  const [fecha, setFecha] = useState("");

  const verify = () => {
    if (fecha != "") {
      const filterByDate = apiOriginal.filter((elem) => elem.fecha == fecha);
      if (filterByDate.length != 0) setTable(filterByDate);
      return true;
    } else return false;
  };

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/maquinaParada`, userSupabase.token],
    fetcherToken,
    {
      onSuccess: (data, evt, config) => {
        if (!verify()) setTable(data);

        setApiOriginal(data);
      },
    }
  );
  
  useEffect(() => {
    if (!verify()) setTable(data);

    setApiOriginal(data);
  }, [data]);

  const getOne = () => {
    return apiOriginal.find((elem) => elem.id == index);
  };

  const updateTable = (idMaquinaParada, object) => {
    setTable(
      apiOriginal.map((elem) => {
        if (idMaquinaParada == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
    setApiOriginal(
      apiOriginal.map((elem) => {
        if (idMaquinaParada == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
  };

  const postTable = (object) => {
    setApiOriginal([object, ...apiOriginal]);
    setTable([object, ...apiOriginal]);
  };

  const deleteTable = (idMaquinaParada) => {
    setTable(apiOriginal.filter((elem) => elem.id != idMaquinaParada));
    setApiOriginal(apiOriginal.filter((elem) => elem.id != idMaquinaParada));
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <MaquinaParadaContext.Provider
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
        fecha,
        setFecha,
      }}
    >
      {props.children}
    </MaquinaParadaContext.Provider>
  );
}
