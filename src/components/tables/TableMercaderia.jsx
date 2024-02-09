import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import useSWR from "swr";
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
import ItemTableMercaderia from "../ItemsTables/ItemTableMercaderia";
import PostMercaderia from "../form/PostMercaderia";
import { FaPen } from "react-icons/fa";
import { BiTrashAlt } from "react-icons/bi";
import DialogUpdateMercaderia from "../dialog/DialogUpdateMercaderia";
import toast from "react-hot-toast";
import { MercaderiaContext } from "../../context/MercaderiaContext";

const fetcher = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function TableMercaderia() {
  const {
    api: data,
    table,
    setTable,
    setIndex,
    index,
    deleteTable,
  } = useContext(MercaderiaContext);
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [page, setPage] = useState(0);

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);

  const getPrevius = () => {
    setTable(data);
    resetTable();
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
    setPage(0);
  };

  const handleDelete = () => {
    toast.promise(
      axios
        .delete(`${BASE_URL}/mercaderia/${index.id}`, {
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
        error: "Ocurrio un Error",
      }
    );
  };

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] place-content-center mt-4">
        <div className="flex flex-col lg:justify-center lg:items-center ">
          <div className="flex flex-row items-center">
            <TextField
              label="Buscar Descripcion"
              size="small"
              onChange={(evt) => {
                const text = evt.target.value;
                if (text != "") {
                  const filterByDescripcion = data.filter((elem) => {
                    return elem.descripcion.includes(text);
                  });
                  resetTable();
                  setTable(filterByDescripcion);
                } else getPrevius();
              }}
            />
            <SearchClientesBox
              filterTable={setTable}
              table={table}
              refresh={getPrevius}
              apiOriginal={data}
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
                        Cod Producto
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Descripcion
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Cantidad
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Categoria
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table
                    
                    .slice(start, end).map((elem) => {
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
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.stock}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 ">
                            {elem.fecha}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 ">
                            {elem.categoria}
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
        </div>
        <div className="flex flex-col lg:flex-col items-center justify-start">
          <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 border lg:mx-5 mx-1 mt-2">
            <ItemTableMercaderia index={index} />
          </div>
          <PostMercaderia />
        </div>
        <DialogUpdateMercaderia
          index={index}
          close={() => setDialogUpdate(false)}
          show={dialogUpdate}
        />
        <Dialog open={dialogDelete} onClose={() => setDialogDelete(false)}>
          <DialogTitle>Eliminar Mercaderia</DialogTitle>
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
    </>
  );
}
