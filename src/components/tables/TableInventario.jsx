import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
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
import SearchClientesBox from "../comboBox/SearchClientesBox";
import { FaPen } from "react-icons/fa";
import DialogUpdateInventario from "../dialog/DialogUpdateInventario";
import { BiTrashAlt } from "react-icons/bi";
import toast from "react-hot-toast";
import { CiSquarePlus } from "react-icons/ci";
import DialogNewInventario from "../dialog/DialogNewInventario";
import { InventarioContext } from "../../context/InventarioContext";

export default function TableInventario() {
  const {
    table,
    refreshTable,
    setTable,
    setIndex,
    index,
    deleteTable,
    api: data,
    descripcion,
    setDescripcion,
    setCliente,
    cliente,
  } = useContext(InventarioContext);
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [dialogNewProduct, setDialogNewProduct] = useState(false);

  const getPrevius = () => {
    if (cliente != "")
      setTable(data.filter((elem) => elem.idcliente == cliente));
    else setTable(data);

    resetTable();
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  const handleDelete = () => {
    setDialogDelete(false);
    toast.promise(
      axios
        .delete(`${BASE_URL}/inventario/${index.id}`, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          deleteTable(index.id);
        }),
      {
        loading: "Eliminando...",
        success: "Operacion exitosa",
        error: (err) => err.response.data.message,
      }
    );
  };

  return (
    <>
      <section className="grid grid-cols-1  place-content-center mt-4">
        <div className="flex flex-col lg:justify-center lg:items-center ">
          <div className="flex flex-row items-center">
            <TextField
              label="Buscar Descripcion"
              size="small"
              value={descripcion}
              onChange={(evt) => {
                const text = evt.target.value;
                setDescripcion(text);
                if (text != "") {
                  if (cliente != "") {
                    const filterByDescripcion = data.filter((elem) => {
                      if (elem.idcliente == cliente) {
                        return elem.descripcion
                          .toLowerCase()
                          .includes(text.toLowerCase().trim());
                      }
                    });
                    setTable(filterByDescripcion);
                  } else {
                    const filterByDescripcion = data.filter((elem) => {
                      return elem.descripcion
                        .toLowerCase()
                        .includes(text.toLowerCase().trim());
                    });
                    setTable(filterByDescripcion);
                  }
                  resetTable();
                } else getPrevius();
              }}
            />
            <SearchClientesBox
              filterTable={setTable}
              table={table}
              refresh={() => setTable(data)}
              apiOriginal={data}
              setCliente={setCliente}
            />
            <Tooltip title="Nuevo Producto">
              <IconButton
                className="hover:text-blue-700"
                onClick={() => setDialogNewProduct(true)}
              >
                <CiSquarePlus />
              </IconButton>
            </Tooltip>
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
                        Cod Producto
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Descripcion
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Stock Actual
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Peso Unidad
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Ubicacion
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.slice(start, end).map((elem) => {
                      const stockActual = elem.entrada - elem.salida;
                      return (
                        <tr
                          className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-cyan-200 hover:text-neutral-800`}
                          key={elem.id}
                          onClick={() => {
                            setIndex(elem);
                          }}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {elem.articulo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.nombre}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.descripcion}
                          </td>
                          <td
                            className={`whitespace-nowrap px-6 py-4 font-medium ${
                              stockActual <= 0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {stockActual}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 ">
                            {elem.pesoUnidad}kg
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.cliente}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.ubicacion}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
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
              count={Math.ceil(table.length / 10)}
              onChange={(evt, value) => {
                const endValue = 10 * parseInt(value);
                setStart(endValue - 10);
                setEnd(endValue);
              }}
            />
          </div>
        </div>
        <DialogUpdateInventario
          show={dialogUpdate}
          close={() => {
            setDialogUpdate(false);
          }}
          refreshTable={refreshTable}
        />
        <DialogNewInventario
          show={dialogNewProduct}
          close={() => setDialogNewProduct(false)}
          refreshTable={refreshTable}
        />
        <Dialog open={dialogDelete} onClose={() => setDialogDelete(false)}>
          <DialogTitle>Eliminar Inventario</DialogTitle>
          <DialogContent>Estas seguro en eliminar el producto ?</DialogContent>
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
    </>
  );
}
