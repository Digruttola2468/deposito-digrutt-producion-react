import { Skeleton, Typography } from "@mui/material";

import useSWR from "swr";

import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const fetcher = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function ItemTableMercaderia({ index }) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, isLoading, error } = useSWR(
    [`${BASE_URL}/mercaderia/${index?.id ?? null}`, userSupabase.token],
    fetcher
  );

  if (index == null) return <></>;

  if (isLoading)
    return (
      <>
        <Typography variant="h1" width={360}>
          <Skeleton animation="pulse" />
        </Typography>
        <Typography variant="p">
          <Skeleton animation="pulse" />
        </Typography>
        <Typography variant="p">
          <Skeleton animation="pulse" />
        </Typography>
        <Typography variant="p">
          <Skeleton animation="pulse" />
        </Typography>
      </>
    );
      console.log(data);

  return (
    <>
      {data != null && (
        <div>
          <h2 className="text-lg font-semibold uppercase">{data.nombre}</h2>

          <p>
            <b>Descripcion</b>: {data.descripcion}
          </p>
          <p>
            <b>Fecha</b>: {data.fecha}
          </p>
          <p>
            <b>Cantidad</b>: {data.stock}
          </p>
          {data.remito ? (
            <p>
              <b>Remito</b>: {data.remito}
            </p>
          ) : (
            <></>
          )}
          {data.nroEnvio ? (
            <p>
              <b>Nota Envio</b>: {data.nroEnvio}
            </p>
          ) : (
            <></>
          )}
          {data.observacion != null && (
            <p>
              <b>Descripcion Salida: </b>: {data.observacion}
            </p>
          )}
        </div>
      )}
    </>
  );
}
