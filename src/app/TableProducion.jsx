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
import { ProducionContext } from "../context/ProduccionContext";
import { FaPen } from "react-icons/fa";
import { BiTrashAlt } from "react-icons/bi";
import DialogUpdateProduccion from "../components/dialog/DialogUpdateProduccion";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";

export default function TableProducion() {
  const { BASE_URL } = useContext(UserContext);
  const { tableOriginal, refreshTable, token } = useContext(ProducionContext);

  const [index, setIndex] = useState(null);

  const [table, setTable] = useState(() => tableOriginal);

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  useEffect(() => {
    setStart(end - 10);
  }, [end]);

  const getPrevius = () => {
    setTable(tableOriginal);
  };

  const handleDelete = () => {
    toast.promise(
      axios
        .delete(`${BASE_URL}/producion/${index.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          setDialogDelete(false);
          refreshTable();
          getPrevius();
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
    <div className="flex flex-col lg:justify-center lg:items-center ">
      <TextField
        label="Buscar Descripcion"
        size="small"
        onChange={(evt) => {
          const text = evt.target.value;
          if (text != "") {
            const filterByDescripcion = tableOriginal.filter((elem) => {
              return elem.descripcion
                .toLowerCase()
                .includes(text.toLowerCase());
            });
            setTable(filterByDescripcion);
          } else getPrevius();
        }}
      />
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden ">
            <table className="min-w-full text-left text-sm font-light ">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Articulo
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Descripcion
                  </th>
                  <th scope="col" className="px-6 py-4">
                    N° Maquina
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Golpes Reales
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Piezas Producidas
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Promedio Golpes/hr
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.slice(start, end).map((elem) => {
                  return (
                    <tr
                      className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                      key={elem.id}
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        {elem.nombre}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {elem.descripcion}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        {elem.num_maquina}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        {elem.golpesReales}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        {elem.piezasProducidas}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        {elem.prom_golpeshora}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
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
      <DialogUpdateProduccion
        show={dialogUpdate}
        close={() => {
          setDialogUpdate(false);
        }}
        index={index}
        refreshTable={refreshTable}
      />
      <Dialog open={dialogDelete} onClose={() => setDialogDelete(false)}>
        <DialogTitle>Eliminar Produccion</DialogTitle>
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
    </div>
  );
}
