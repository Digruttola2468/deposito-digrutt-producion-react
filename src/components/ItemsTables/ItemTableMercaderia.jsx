import {
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";

import useSWR from "swr";

import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import PostMercaderia from "../form/PostMercaderia";

const fetcher = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function ItemTableMercaderia({ index, refreshTableOficina }) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, isLoading, error } = useSWR(
    [`${BASE_URL}/mercaderia/${index}`, userSupabase.token],
    fetcher
  );

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
        </div>
      )}
    </>
  );
}
