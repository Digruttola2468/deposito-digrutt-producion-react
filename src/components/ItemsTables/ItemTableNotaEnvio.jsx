import {
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";

import useSWR from "swr";

import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { FaFileExcel } from "react-icons/fa";

const monthNames = [
  "Ene",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const fetcher = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function ItemTableNotaEnvio({ index, refreshTableOficina }) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/facturaNegro/${index}`, userSupabase.token],
    fetcher
  );

  //Dialogs
  const [dialogDeleteNotaEnvio, setDialogDeleteNotaEnvio] = useState(false);

  const handleClickUpdate = () => setDialogUpdateRemito(true);
  const handleClickDelete = () => setDialogDeleteNotaEnvio(true);
  const handleClickUpdateNewMercaderia = () => setDialogNewMercaderia(true);

  const handleClickDeleteRemito = async () => {
    toast.error("No esa habilitado");
    /*toast.promise(
      axios
        .delete(`${BASE_URL}/facturaNegro/${data.remito.id}`, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {mutate(); refreshTableOficina()}),
      {
        loading: "Eliminando...",
        success: "Eliminado Con Exito",
        error: "No se elimino",
      }
    );*/
  };

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

  if (error) return <></>;

  return (
    <>
      {data.notaEnvio != null ? (
        <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 border lg:mx-5 mx-1 mt-2">
          <h5 className="relative text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            {data.notaEnvio.nro_envio}
            <span className="absolute right-1">
              <FaFileExcel className="hover:text-green-700 cursor-pointer transition-all duration-300" onClick={() => {}} />
            </span>
          </h5>
          <p className="mb-4  text-neutral-600 dark:text-neutral-200 text-sm">
            {data.notaEnvio.fecha} - {data.notaEnvio.cliente} - {`$${data.notaEnvio.valorDeclarado}`}
          </p>
          {data.mercaderia.map((elem) => {
            return (
              <div key={elem.id}>
                <p>
                 ✔️{elem.nombre} - {elem.descripcion} -{" "}
                  <span className="text-red-400">{elem.stock}</span>
                </p>{" "}
                <p></p>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
