import { TbPdf } from "react-icons/tb";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";

import { CiSquarePlus } from "react-icons/ci";

import { FaTrash } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import useSWR from "swr";

import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import RemitoA4PDF from "../pdf/RemitoA4PDF";

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

export default function ItemTableOficina({ index, refreshTableOficina }) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/remito/${index}`, userSupabase.token],
    fetcher
  );

  //Dialogs
  const [dialogNewMercaderia, setDialogNewMercaderia] = useState(false);
  const [dialogUpdateRemito, setDialogUpdateRemito] = useState(false);
  const [dialogDeleteRemito, setDialogDeleteRemito] = useState(false);

  const handleClickUpdate = () => setDialogUpdateRemito(true);
  const handleClickDelete = () => setDialogDeleteRemito(true);
  const handleClickUpdateNewMercaderia = () => setDialogNewMercaderia(true);

  const handleClickDeleteRemito = async () => {
    toast.promise(
      axios
        .delete(`${BASE_URL}/remito/${data.remito.id}`, {
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
    );
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
      {data.remito != null ? (
        <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 border lg:mx-5 mx-1 mt-2">
          <h5 className="relative text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            {data.remito.num_remito}
            <span className="absolute right-1">
              <PDFDownloadLink
                document={
                  <RemitoA4PDF
                    CUIT={data.remito.cuit}
                    cliente={data.remito.cliente}
                    fecha={data.remito.fecha}
                    domicilio={data.remito.domicilio}
                    totalDeclarado={data.remito.total}
                    products={data.mercaderia}
                  />
                }
                fileName={`${data.remito.num_remito}-remito.pdf`}
              >
                <TbPdf className="hover:text-red-500 cursor-pointer transition-all duration-300" />
              </PDFDownloadLink>
            </span>
          </h5>
          <p className="mb-4  text-neutral-600 dark:text-neutral-200 text-sm">
            {data.remito.fecha} -{" "}
            {data.remito.cliente} -{" "}
            {`$${data.remito.total}`}
          </p>
          {data.mercaderia.map((elem) => {
            return (
              <div key={elem.id} className="relative">
                <p>
                  ✔️{elem.nombre} - {elem.descripcion} -{" "}
                  <span className="text-red-400">{elem.stock}</span>
                </p>
              </div>
            );
          })}
          <div className="flex flex-row justify-end my-2">
            <div className="justify-self-start w-full">
              <Tooltip
                title="Agregar nueva mercaderia"
                className=" hover:text-blue-400"
                onClick={handleClickUpdateNewMercaderia}
              >
                <IconButton>
                  <CiSquarePlus />
                </IconButton>
              </Tooltip>
            </div>
            <Tooltip
              title="Actualizar"
              className=" hover:text-blue-400"
              onClick={handleClickUpdate}
            >
              <IconButton size="small">
                <FaPen />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Eliminar"
              className="hover:text-red-400"
              onClick={handleClickDelete}
            >
              <IconButton size="small">
                <FaTrash />
              </IconButton>
            </Tooltip>
          </div>
          <Dialog
            open={dialogDeleteRemito}
            onClose={() => setDialogDeleteRemito(false)}
          >
            <DialogTitle>Eliminar Remito</DialogTitle>
            <DialogContent>Estas seguro que queres eliminar ??</DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogDeleteRemito(false)}>
                Cancelar
              </Button>
              <Button onClick={handleClickDeleteRemito} autoFocus>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
