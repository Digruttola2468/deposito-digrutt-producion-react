import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Slide,
  Snackbar,
  TextField,
  Tooltip,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MatricesContext } from "../context/MatricesContext";
import PostHistorialFalloseMatrices from "../components/form/PostHistorialFallosMatrices";
import useSWR from "swr";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import SearchClientesBox from "../components/comboBox/SearchClientesBox";
import { FaPen } from "react-icons/fa";
import { BiTrashAlt } from "react-icons/bi";
import DialogUpdateMatrices from "../components/dialog/DialogUpdateMatrices";
import DialogNewMatriz from "../components/dialog/DialogNewMatriz";
import { CiSquarePlus } from "react-icons/ci";
import toast from "react-hot-toast";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function TableMatrices() {
  const { userSupabase, BASE_URL } = useContext(UserContext);
  const { setApiOne } = useContext(MatricesContext);

  const { data, isLoading, error, mutate } = useSWR(
    [
      `https://deposito-digrutt-express-production.up.railway.app/api/matrices`,
      userSupabase.token,
    ],
    fetcherToken,
    {
      onSuccess: (data, key, config) => {
        setTable(data);
      },
    }
  );

  const [table, setTable] = useState(data);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(10);
  const [page, setPage] = useState(1);
  const [index, setIndex] = useState(null);

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [dialogNewMatriz, setDialogNewMatriz] = useState(false);

  useEffect(() => {
    setStart(end - 10);
  }, [end]);

  const getPreviuos = () => {
    resetTable();
    setTable(data);
  };

  const resetTable = () => {
    setPage(1);
    setStart(0);
    setEnd(10);
  };

  const handleDelete = () => {
    toast.promise(
      axios
        .delete(`${BASE_URL}/matrices/${index.id}`, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          mutate();
          setDialogDelete(false)
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

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr]">
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div className="flex flex-row items-center">
          <TextField
            label="Buscar Descripcion"
            size="small"
            onChange={(evt) => {
              const text = evt.target.value;
              if (text != "") {
                const filter = data.filter((elem) => {
                  return elem.descripcion
                    .toLowerCase()
                    .includes(text.toLowerCase().trim());
                });
                setTable(filter);
                resetTable();
              } else getPreviuos();
            }}
          />
          <SearchClientesBox
            filterTable={setTable}
            table={table}
            refresh={getPreviuos}
            apiOriginal={data}
          />
          <Tooltip title="Nueva Matriz">
            <IconButton
              className="hover:text-blue-700"
              onClick={() => setDialogNewMatriz(true)}
            >
              <CiSquarePlus />
            </IconButton>
          </Tooltip>
        </div>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full sm:max-w-[1200px] py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden ">
              <table className="min-w-full text-left text-sm font-light ">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Cod Matriz
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Descripcion
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Cant Pieza x Golpe
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Material
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Numero Matriz
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
                        onClick={() => setApiOne(elem)}
                      >
                        <td className="text-center whitespace-nowrap px-6 py-4  font-medium">
                          {elem.cod_matriz}
                        </td>
                        <td className="text-center whitespace-nowrap px-6 py-4">
                          {elem.descripcion}
                        </td>
                        <td className="text-center whitespace-nowrap px-6 py-4">
                          {elem.cantPiezaGolpe}
                        </td>
                        <td className="text-center whitespace-nowrap px-6 py-4 ">
                          {elem.cliente}
                        </td>
                        <td className="text-center whitespace-nowrap px-6 py-4 ">
                          {elem.material}
                        </td>
                        <td className="text-center whitespace-nowrap px-6 py-4 ">
                          {elem.numero_matriz}
                        </td>
                        <td className="text-center whitespace-nowrap px-6 py-4 ">
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
              setEnd(10 * parseInt(value));
              setPage(value);
            }}
          />
        </div>
      </div>
      <div>
        <PostHistorialFalloseMatrices />
      </div>
      <DialogUpdateMatrices
        show={dialogUpdate}
        index={index}
        close={() => setDialogUpdate(false)}
        refreshTable={mutate}
      />
      <DialogNewMatriz
        show={dialogNewMatriz}
        close={() => {
          setDialogNewMatriz(false);
        }}
      />
      <Dialog open={dialogDelete} onClose={() => setDialogDelete(false)}>
        <DialogTitle>Eliminar Matriz</DialogTitle>
        <DialogContent>Estas seguro en eliminar la Matriz ?</DialogContent>
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
