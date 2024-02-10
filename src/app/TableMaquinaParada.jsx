import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  TextField,
  Tooltip,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MaquinaParadaContext } from "../context/MaquinaParadaContext";
import PostMaquinaParada from "../components/form/PostMaquinaParada";
import { FaPen } from "react-icons/fa";
import { BiTrashAlt } from "react-icons/bi";
import DialogUpdateMaquinaParada from "../components/dialog/DialogUpdateMaquinaParada";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function TableMaquinaParada() {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { apiOriginal, table, setTable, index, setIndex, deleteTable, fecha, setFecha } =
    useContext(MaquinaParadaContext);

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);

  const [page, setPage] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const getPreviuos = () => {
    setTable(apiOriginal);
  };

  const handleDelete = () => {
    toast.promise(
      axios
        .delete(`${BASE_URL}/maquinaParada/${index.id}`, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          deleteTable(index.id);
          setDialogDelete(false);
        }),
      {
        loading: "Eliminando...",
        success: "Operacion Exitosa",
        error: (err) => {
          console.log(err);
          return "Ocurrio un error";
        },
      }
    );
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] place-content-center">
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div className="flex flex-col md:flex-row justify-self-start items-center">
          <TextField
            type="date"
            value={fecha}
            onChange={(evt) => {
              const fechaString = evt.target.value;
              setFecha(fechaString);
              const filterByDate = apiOriginal.filter((elem) => elem.fecha == fechaString);
              setTable(filterByDate);
            }}
            sx={{ width: "150px" }}
          />
          <Button
            onClick={() => {
              resetTable();
              getPreviuos();
              setFecha("");
            }}
          >
            Borrar
          </Button>
        </div>

        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full sm:max-w-[1000px] py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden ">
              <table className="min-w-full text-left text-sm font-light ">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Maquina
                    </th>
                    <th scope="col" className="px-6 py-4">
                      N° Maquina
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Hrs Parada
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Motivo Maquina Parada
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.slice(start, end).map((elem, index) => {
                    return (
                      <tr
                        className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                        key={index}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {elem.nombre}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.numberSerie}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.hrs}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          {elem.descripcion}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          {elem.fecha}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          <Tooltip
                            onClick={() => {
                              setIndex(elem);
                              setDialogUpdate(true);
                            }}
                          >
                            <IconButton
                              size="small"
                              className="hover:text-blue-400"
                            >
                              <FaPen />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            onClick={() => {
                              setIndex(elem);
                              setDialogDelete(true);
                            }}
                          >
                            <IconButton
                              size="small"
                              className="hover:text-red-400"
                            >
                              <BiTrashAlt />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center ">
          <Pagination
            count={Math.ceil(apiOriginal.length / 10)}
            page={page}
            onChange={(evt, value) => {
              setPage(value);
              const endValue = 10 * parseInt(value);
              setStart(endValue - 10);
              setEnd(endValue);
            }}
          />
        </div>
      </div>
      <div>
        <PostMaquinaParada />
      </div>
      <DialogUpdateMaquinaParada
        show={dialogUpdate}
        close={() => setDialogUpdate(false)}
        index={index}
        refreshTable={getPreviuos}
      />
      <Dialog open={dialogDelete} onClose={() => setDialogDelete(false)}>
        <DialogTitle>Eliminar Maquina Parada</DialogTitle>
        <DialogContent>Estas seguro en eliminar ?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogDelete(false)} variant="text">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}

/**
 *  Range Date
 * <div className="flex flex-row items-center">
            <span className="pr-1">Empieza</span>
            <TextField
              type="date"
              value={startFecha}
              onChange={(evt) => {
                const fechaString = evt.target.value;
                setStartFecha(fechaString);
                if (fechaString != "") {
                  const filterDate = apiOriginal.filter(
                    (elem) => new Date(elem.fecha) >= new Date(fechaString)
                  );
                  if (filterDate.length == 0) {
                    toast.error("No hay datos");
                  } else {
                    setTable(filterDate);
                    resetTable();
                  }
                } else getPreviuos();
              }}
              sx={{ width: "150px" }}
            />
          </div>
          <div className="flex flex-row items-center mt-2">
            <span className="pr-1">Termina</span>
            <TextField
              type="date"
              value={endFecha}
              onChange={(evt) => {
                const fechaString = evt.target.value;
                setEndFecha(fechaString);
                if (fechaString != "") {
                  const filterDate = apiOriginal.filter(
                    (elem) => new Date(elem.fecha) <= new Date(fechaString)
                  );
                  if (filterDate.length == 0) {
                    toast.error("No hay datos");
                  } else {
                    setTable(filterDate);
                    resetTable();
                  }
                } else getPreviuos();
              }}
              sx={{ width: "150px" }}
            />
          </div>
 * 
 * 
 */
