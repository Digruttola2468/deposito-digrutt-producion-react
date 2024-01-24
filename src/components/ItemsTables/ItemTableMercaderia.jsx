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
      <Card className="w-[300px]">
        <CardContent>
          <Typography variant="h1">
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
        </CardContent>
        <CardActions>
          <Skeleton
            variant="circular"
            animation="pulse"
            width={20}
            height={20}
          />
          <Skeleton
            variant="circular"
            animation="pulse"
            width={20}
            height={20}
          />
        </CardActions>
      </Card>
    );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <>
      {data != null ? (
        <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 border lg:mx-5 mx-1 mt-2">
          <div >
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
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
