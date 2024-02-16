import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const NotaEnvioContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function NotaEnvioContextProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [index, setIndex] = useState(null);
  const [table, setTable] = useState([]);
  const [apiOriginal, setApiOriginal] = useState([]);

  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");

  const verify = () => {
    if (descripcion != "") {
      const filterByDescripcion = apiOriginal.filter((elem) => {
        return elem.descripcion
          .toLowerCase()
          .includes(text.toLowerCase().trim());
      });
      setTable(filterByDescripcion);
      return true;
    } else if (fecha != "") {
      const filterByDate = apiOriginal.filter((elem) => elem.fecha == fecha);
      if (filterByDate.length != 0) setTable(filterByDate);
      return true;
    } else return false;
  };

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/facturaNegro`, userSupabase.token],
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

  const updateTable = (idNotaEnvio, object) => {
    setTable(
      apiOriginal.map((elem) => {
        if (idNotaEnvio == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
    setApiOriginal(
      apiOriginal.map((elem) => {
        if (idNotaEnvio == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
  };

  const postTable = (object) => {
    setApiOriginal([object, ...apiOriginal]);
    setTable([object, ...apiOriginal]);
  };

  const deleteTable = (idNotaEnvio) => {
    setTable(apiOriginal.filter((elem) => elem.id != idNotaEnvio));
    setApiOriginal(apiOriginal.filter((elem) => elem.id != idNotaEnvio));
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <NotaEnvioContext.Provider
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
        descripcion,
        setDescripcion,
        fecha,
        setFecha,
      }}
    >
      {props.children}
    </NotaEnvioContext.Provider>
  );
}
