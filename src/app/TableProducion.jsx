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
  const {
    table,
    setTable,
    token,
    index,
    setIndex,
    apiOriginal,
    deleteTable,
    descripcion,
    setDescripcion,
    fecha,
    setFecha,
  } = useContext(ProducionContext);
  const { BASE_URL } = useContext(UserContext);

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);

  const [page, setPage] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const getPrevius = () => {
    resetTable();
    setTable(apiOriginal);
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
          deleteTable(index.id);
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
    setPage(1);
    setStart(0);
    setEnd(10);
  };

  return (
    <div className="flex flex-col lg:justify-center lg:items-center ">
      <div className="flex flex-row gap-1 m-1">
        <TextField
          label="Buscar Descripcion"
          size="small"
          value={descripcion}
          onChange={(evt) => {
            const text = evt.target.value;
            setDescripcion(text);
            setFecha("");
            if (text != "") {
              const filterByDescripcion = apiOriginal.filter((elem) => {
                return elem.descripcion
                  .toLowerCase()
                  .includes(text.toLowerCase().trim());
              });
              resetTable();
              setTable(filterByDescripcion);
            } else getPrevius();
          }}
        />
        <TextField
          size="small"
          type="date"
          value={fecha}
          sx={{ minWidth: "100px" }}
          onChange={(evt) => {
            const fecha = evt.target.value;
            setDescripcion("");
            setFecha(fecha);
            if (fecha != "") {
              const filterByDate = apiOriginal.filter(
                (elem) => elem.fecha == fecha
              );
              if (filterByDate.length != 0) {
                resetTable();
                setTable(filterByDate);
              } else toast.error("No hay datos");
            } else getPrevius();
          }}
        />
      </div>
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
                        {new String(elem.descripcion).length >= 50
                          ? `${elem.descripcion.slice(0, 50)} ...`
                          : elem.descripcion}
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
          page={page}
          count={Math.ceil(table.length / 10)}
          onChange={(evt, value) => {
            setPage(value);
            const endValue = 10 * parseInt(value);
            setStart(endValue - 10);
            setEnd(endValue);
          }}
        />
      </div>
      <DialogUpdateProduccion
        show={dialogUpdate}
        close={() => {
          setDialogUpdate(false);
        }}
        index={index}
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
