import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";

import useSWR from "swr";

import fileDownload from "js-file-download";
import axios from "axios";

import { toast } from "react-hot-toast";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { FaFileExcel, FaPen, FaTrash } from "react-icons/fa";
import { NotaEnvioContext } from "../../context/NotaEnvioContext";

const fetcher = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function ItemTableNotaEnvio() {
  const { userSupabase, BASE_URL } = useContext(UserContext);
  const { index, deleteTable } = useContext(NotaEnvioContext);

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/facturaNegro/${index.id}`, userSupabase.token],
    fetcher
  );

  //Dialogs
  const [dialogDeleteNotaEnvio, setDialogDeleteNotaEnvio] = useState(false);
  const [dialogUpdateNotaEnvio, setDialogUpdateNotaEnvio] = useState(false);

  const handleClickExcel = async () => {
    axios({
      url: `${BASE_URL}/excel/notaEnvio/${data.notaEnvio.id}`,
      headers: {
        Authorization: `Bearer ${userSupabase.token}`,
      },
      method: "GET",
      responseType: "blob",
    }).then((res) => {
      fileDownload(res.data, `NotaEnvio_${data.notaEnvio.nro_envio}.xlsx`);
    });
  };

  const handleClickDeleteRemito = async () => {
    toast.promise(
      axios
        .delete(`${BASE_URL}/facturaNegro/${index.id}`, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          toast.success("Eliminado Correctamente");
          deleteTable(index.id);
          setDialogDeleteNotaEnvio(false);
        })
        .catch((er) => {
          toast.error("No se Elimino");
        }),
      {
        loading: "Eliminando...",
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

  if (data.error)
    return (
      <div>
        <h1>No tiene salida de mercaderia</h1>
        <div className="mt-5 flex flex-row gap-2">
          <Tooltip
            title="Actualizar"
            className=" hover:text-blue-400"
            onClick={() => {}}
          >
            <IconButton size="small">
              <FaPen />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Eliminar"
            className="hover:text-red-400"
            onClick={() => {
              setDialogDeleteNotaEnvio(true);
            }}
          >
            <IconButton size="small">
              <FaTrash />
            </IconButton>
          </Tooltip>
        </div>
        <Dialog
          open={dialogDeleteNotaEnvio}
          onClose={() => setDialogDeleteNotaEnvio(false)}
        >
          <DialogTitle>Eliminar Nota Envio {index.nro_envio}</DialogTitle>
          <DialogContent>
            Estas seguro en eliminar la nota envio ?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDialogDeleteNotaEnvio(false)}
              variant="text"
            >
              Cancelar
            </Button>
            <Button onClick={handleClickDeleteRemito} variant="outlined">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

  return (
    <>
      {data.notaEnvio != null ? (
        <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 border lg:mx-5 mx-1 mt-2">
          <h5 className="relative text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
            {data.notaEnvio.nro_envio}
            <span className="absolute right-1">
              <Tooltip title="Crear Excel">
                <IconButton
                  className="hover:text-green-700 cursor-pointer transition-all duration-300"
                  onClick={() => handleClickExcel()}
                >
                  <FaFileExcel />
                </IconButton>
              </Tooltip>
            </span>
          </h5>
          <p className="mb-4  text-neutral-600 dark:text-neutral-200 text-sm">
            {data.notaEnvio.fecha} - {data.notaEnvio.cliente} -{" "}
            {`$${data.notaEnvio.valorDeclarado}`}
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

          <div className="mt-5 flex flex-row gap-2">
            <Tooltip
              title="Actualizar"
              className=" hover:text-blue-400"
              onClick={() => {}}
            >
              <IconButton size="small">
                <FaPen />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Eliminar"
              className="hover:text-red-400"
              onClick={() => setDialogDeleteNotaEnvio(true)}
            >
              <IconButton size="small">
                <FaTrash />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        <></>
      )}

      <Dialog
        open={dialogDeleteNotaEnvio}
        onClose={() => setDialogDeleteNotaEnvio(false)}
      >
        <DialogTitle>Eliminar Nota Envio {index.nro_envio}</DialogTitle>
        <DialogContent>Estas seguro en eliminar la nota envio ?</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogDeleteNotaEnvio(false)}
            variant="text"
          >
            Cancelar
          </Button>
          <Button onClick={handleClickDeleteRemito} variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
