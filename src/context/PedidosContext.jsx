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
  const {userSupabase} = useContext(UserContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/pedidos`, userSupabase.token],
    fetcherToken
  );

  const [index, setIndex] = useState();
  
  const getOne = () => {
    return data.find(elem => elem.id == index)
  }

  if (isLoading) return <></>;
  if (error) return <></>;

  console.log(data);
/**{
    "id": 3,
    "idinventario": 4,
    "idcliente": 5,
    "stock": 500,
    "fecha_entrega": "2024-02-12",
    "is_done": 0,
    "stockDisposicion": 250,
    "cliente": "Fede Plast - Daniel LaSala",
    "nombre": "arandelon185",
    "descripcion": "arandelon negro ( gec sa ) x 50 unidad",
    "url_image": null,
    "articulo": "GEC001A0N"
} */
  return (
    <PedidosContext.Provider
      value={{
        tableOriginal: data,
        refreshTable: mutate,
        token: userSupabase.token,
        base_url: BASE_URL,
        fetcherToken,
        getOne, 
        setIndex
      }}
    >
      {props.children}
    </PedidosContext.Provider>
  );
}
