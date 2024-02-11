import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Pagination,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { FaPen } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import SearchLocalidadBox from "../comboBox/SearchLocalidadBox";
import DialogUpdateCliente from "../dialog/DialogUpdateCliente";

import { IoRefresh } from "react-icons/io5";
import { BiTrashAlt } from "react-icons/bi";
import { CiSquarePlus } from "react-icons/ci";
import DialogNewCliente from "../dialog/DialogNewCliente";
import toast from "react-hot-toast";
import { ClientesContext } from "../../context/ClientesContext";

export default function TableClientes() {
  const {
    table,
    setTable,
    index,
    setIndex,
    api: data,
    refreshTable,
    deleteTable,
    descripcion,
    setDescripcion,
    localidad,
    setLocalidad,
  } = useContext(ClientesContext);
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [dialogNewProduct, setDialogNewProduct] = useState(false);

  const getPrevius = () => {
    if (localidad != "")
      setTable(data.filter((elem) => elem.ciudad == localidad));
    else setTable(data);

    resetTable();
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  const handleDelete = () => {
    toast.promise(
      axios
        .delete(`${BASE_URL}/clientes/${index.id}`, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          deleteTable(index.id);
          setDialogDelete(false);
        }),
      {
        loading: "Eliminando Cliente...",
        success: "Operacion Exitosa",
        error: (err) => {
          setDialogDelete(false);
          return err.response.data.message;
        },
      }
    );
  };

  return (
    <>
      <section className="grid grid-cols-1  place-content-center mt-4">
        <Divider>
          <div className="flex flex-row items-center">
            <h1 className="uppercase text-center my-2 font-bold text-lg">
              TABLA CLIENTES
            </h1>
            <span
              className="mx-2 cursor-pointer"
              onClick={() => {
                refreshTable();
              }}
            >
              <IoRefresh />
            </span>
          </div>
        </Divider>
        <div className="flex flex-col lg:justify-center lg:items-center ">
          <div className="flex flex-row items-center">
            <TextField
              label="Buscar Cliente"
              size="small"
              value={descripcion}
              onChange={(evt) => {
                const text = evt.target.value;
                setDescripcion(text);
                if (text != "") {
                  if (localidad != "") {
                    const filterByDescripcion = data.filter((elem) => {
                      if (elem.ciudad == localidad) {
                        return elem.cliente
                          .toLowerCase()
                          .includes(text.toLowerCase().trim());
                      }
                    });
                    setTable(filterByDescripcion);
                  } else {
                    const filterByDescripcion = data.filter((elem) => {
                      return elem.cliente
                      .toLowerCase()
                      .includes(text.toLowerCase().trim());
                    });
                    setTable(filterByDescripcion);
                  }
                  resetTable();
                } else getPrevius();
              }}
            />
            <SearchLocalidadBox
              filterTable={setTable}
              refresh={() => {
                setTable(data);
              }}
              apiOriginal={data}
              setLocalidad={setLocalidad}
            />
            <Tooltip title="Nuevo Cliente">
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
                        Codigo
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Domicilio
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Gmail
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Cuit
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Ciudad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.slice(start, end).map((elem) => {
                      return (
                        <tr
                          className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-cyan-200 hover:text-neutral-800`}
                          key={elem.id}
                          onClick={() => {
                            setIndex(elem);
                          }}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {elem.codigo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.cliente}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.domicilio}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 ">
                            {elem.mail}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.cuit}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.ciudad}
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
      </section>
      <DialogUpdateCliente
        index={index}
        show={dialogUpdate}
        close={() => {
          setDialogUpdate(false);
        }}
        refreshTable={refreshTable}
      />
      <DialogNewCliente
        show={dialogNewProduct}
        close={() => {
          setDialogNewProduct(false);
        }}
      />
      <Dialog open={dialogDelete} onClose={() => setDialogDelete(false)}>
        <DialogTitle>Eliminar Cliente</DialogTitle>
        <DialogContent>Estas seguro en eliminar el cliente ?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogDelete(false)} variant="text">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
