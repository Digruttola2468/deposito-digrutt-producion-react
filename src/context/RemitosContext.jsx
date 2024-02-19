import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const RemitosContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function RemitosContextProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [index, setIndex] = useState(null);
  const [table, setTable] = useState([]);
  const [apiOriginal, setApiOriginal] = useState([]);

  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");

  const [indexMercaderia, setIndexMercaderia] = useState([]);

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
    [`${BASE_URL}/remito`, userSupabase.token],
    fetcherToken,
    {
      onSuccess: (data, evt, config) => {
        setTable(data);

        setApiOriginal(data);
      },
    }
  );

  useEffect(() => {
    setTable(data);

    setApiOriginal(data);
  }, [data]);

  const getOne = () => {
    return apiOriginal.find((elem) => elem.id == index);
  };

  const updateTable = (idRemito, object) => {
    setTable(
      apiOriginal.map((elem) => {
        if (idRemito == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
    setApiOriginal(
      apiOriginal.map((elem) => {
        if (idRemito == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
  };

  const postTable = (object) => {
    setApiOriginal([object, ...apiOriginal]);
    setTable([object, ...apiOriginal]);
  };

  const deleteTable = (idRemito) => {
    setTable(apiOriginal.filter((elem) => elem.id != idRemito));
    setApiOriginal(apiOriginal.filter((elem) => elem.id != idRemito));
    setIndex(null)
    setIndexMercaderia([]);
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <RemitosContext.Provider
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
        indexMercaderia,
        setIndexMercaderia,
      }}
    >
      {props.children}
    </RemitosContext.Provider>
  );
}
