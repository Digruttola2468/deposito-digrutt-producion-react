import axios from "axios";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "./UserContext";

export const MercaderiaContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data.data);
};

export default function MercaderiaProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [index, setIndex] = useState(null);
  const [table, setTable] = useState([]);
  const [apiOriginal, setApiOriginal] = useState([]);

  const [descripcion, setDescripcion] = useState("");
  const [cliente, setCliente] = useState("");

  const verify = () => {
    if (descripcion != "") {
      const filterByDescripcion = apiOriginal.filter((elem) => {
        return elem.descripcion
          .toLowerCase()
          .includes(text.toLowerCase().trim());
      });
      setTable(filterByDescripcion);
      return true;
    } else return false;
  };

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/mercaderia`, userSupabase.token],
    fetcherToken,
    {
      onSuccess: (data, evt, config) => {
        if (!verify()) setTable(data);

        setApiOriginal(data);
      },
    }
  );

  const getOne = () => {
    return apiOriginal.find((elem) => elem.id == index);
  };

  const updateTable = (idProduccion, object) => {
    setTable(
      apiOriginal.map((elem) => {
        if (idProduccion == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
    setApiOriginal(
      apiOriginal.map((elem) => {
        if (idProduccion == elem.id) return { ...elem, ...object };
        else return elem;
      })
    );
  };

  const postTable = (object) => {
    setApiOriginal([object, ...apiOriginal]);
    setTable([object, ...apiOriginal]);
  };

  const deleteTable = (idProduccion) => {
    setTable(apiOriginal.filter((elem) => elem.id != idProduccion));
    setApiOriginal(apiOriginal.filter((elem) => elem.id != idProduccion));
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <MercaderiaContext.Provider
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
        cliente, 
        setCliente
      }}
    >
      {props.children}
    </MercaderiaContext.Provider>
  );
}

/*
export const MercaderiaContext = createContext();

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function MercaderiaProvider(props) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [index, setIndex] = useState(null);
  const [table, setTable] = useState([]);

  let { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/mercaderia`, userSupabase.token],
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

  const updateTable = (idMercaderia, object) => {
    data = data.map((elem) => {
      if (idMercaderia == elem.id) return { ...elem, ...object };
      else return elem;
    });
    setTable([...data]);
  };

  const postTable = (object) => {
    data.push(object);
    setTable([object, ...data]);
  };

  const deleteTable = (idMercaderia) => {
    data = data.filter((elem) => elem.id != idMercaderia);
    
    setTable([...data]);
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <MercaderiaContext.Provider
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
    </MercaderiaContext.Provider>
  );
}
*/
