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
  const { tableOriginal } = useContext(MaquinaParadaContext);

  const [index, setIndex] = useState(null);

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);

  const [table, setTable] = useState(() => tableOriginal);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const [startFecha, setStartFecha] = useState("");
  const [endFecha, setEndFecha] = useState("");

  useEffect(() => {
    setStart(end - 10);
  }, [end]);

  const getPreviuos = () => {
    setTable(tableOriginal);
  };

  const handleDelete = () => {
    toast.promise(
      axios.delete(`${BASE_URL}/maquinaParada/${index.id}`, {
        headers: {
          Authorization: `Bearer ${userSupabase.token}`,
        },
      }).then(result => {
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
          <div className="flex flex-row items-center">
            <span className="pr-1">Empieza</span>
            <TextField
              type="date"
              value={startFecha}
              onChange={(evt) => {
                const fechaString = evt.target.value;
                setStartFecha(fechaString);
                if (fechaString != "") {
                  const filterDate = tableOriginal.filter(
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
                  const filterDate = tableOriginal.filter(
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
          <Button
            onClick={() => {
              resetTable();
              getPreviuos();
              setEndFecha("");
              setStartFecha("");
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
            count={Math.ceil(tableOriginal.length / 10)}
            onChange={(evt, value) => {
              setEnd(10 * parseInt(value));
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
