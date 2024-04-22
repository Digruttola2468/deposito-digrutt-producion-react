import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Pagination,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { FaCheck, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { BiTrashAlt } from "react-icons/bi";
import { FaPen } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DialogUpdateHistorialErroresMatrices from "../dialog/DialogUpdateHistorialErroresMatrices";
import { HistorialMatrizContext } from "../../context/HistorialMatrizContext";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function TableHistorialErrorMatrices() {
  const { table, setTable, index, setIndex, apiOriginal, updateTable, deleteTable } = useContext(HistorialMatrizContext);
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [arrow, setArrow] = useState({ order: "ASC", campus: null });
  const [page, setPage] = useState(1);

  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);

  const handleUpdateIsDone = (idHistorial, isDone) => {
    const value = isDone ? "1" : "0";
    toast.promise(
      axios
        .put(`${BASE_URL}/historialMatriz/${idHistorial}/${value}`, null, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          const response = result.data.data;
          updateTable(idHistorial, response);
        }),
      {
        loading: "Cargando...",
        success: "Se actualizo correctamente",
        error: (err) => err.response.data.message,
      }
    );
  };
  
  const handleDeleteItem = () => {
    toast.promise(
      axios
        .delete(`${BASE_URL}/historialMatriz/${index.id}`, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          deleteTable(index.id);
          setDialogDelete(false)
        }),
      {
        loading: "Cargando...",
        success: "Se elimino correctamente",
        error: "Something wrong",
      }
    );
  };

  const resetTable = () => {
    setPage(1);
    setStart(0);
    setEnd(10);
  };

  const getPrevius = () => {
    resetTable();
    setTable(apiOriginal);
  };

  const handleOrderIsDone = (campus) => {
    setArrow({ campus, order: arrow.order == "ASC" ? "DESC" : "ASC" });
  };

  //Order Table
  const orderByIsDone = (value) => {
    if (value == "ASC") {
      table.sort(function (a, b) {
        if (a.isSolved < b.isSolved) return 1;

        if (a.isSolved > b.isSolved) return -1;

        return 0;
      });
    }
    if (value == "DESC") {
      table.sort(function (a, b) {
        if (a.isSolved > b.isSolved) return 1;

        if (a.isSolved < b.isSolved) return -1;

        return 0;
      });
    }
  };

  const orderByDateStartMistake = (value) => {
    if (value == "ASC") {
      table.sort((a, b) => {
        return new Date(b.fecha) - new Date(a.fecha);
      });
    }
    if (value == "DESC") {
      table.sort((a, b) => {
        return new Date(a.fecha) - new Date(b.fecha);
      });
    }
  };

  const orderByDateDoneMistake = (value) => {
    if (value == "ASC") {
      table.sort((a, b) => {
        return new Date(b.fechaTerminado) - new Date(a.fechaTerminado);
      });
    }
    if (value == "DESC") {
      table.sort((a, b) => {
        return new Date(a.fechaTerminado) - new Date(b.fechaTerminado);
      });
    }
  };

  const renderIconArrowIsDone = (callback) => {
    if (arrow.order != null) {
      callback(arrow.order);

      if (arrow.order == "ASC")
        return <FaLongArrowAltDown className="absolute right-0 bottom-5" />;
      else if (arrow.order == "DESC")
        return <FaLongArrowAltUp className="absolute right-0 bottom-5" />;
    }

    return <></>;
  };

  return (
    <section>
      <Divider>
        <h1 className="uppercase font-bold text-lg">Table Historial</h1>
      </Divider>
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden ">
              <table className="min-w-full text-left text-sm font-light ">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-center">
                      Cod Matriz
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Descripcion Falla
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Categoria
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-4 text-center relative`}
                      onClick={() => {
                        handleOrderIsDone("fechaStart");
                      }}
                    >
                      Fecha
                      {arrow.campus == "fechaStart" ? (
                        renderIconArrowIsDone(orderByDateStartMistake)
                      ) : (
                        <></>
                      )}
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-4 text-center relative`}
                      onClick={() => {
                        handleOrderIsDone("isDone");
                      }}
                    >
                      Esta Reparado?
                      {arrow.campus == "isDone" ? (
                        renderIconArrowIsDone(orderByIsDone)
                      ) : (
                        <></>
                      )}
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-4 text-center relative`}
                      onClick={() => {
                        handleOrderIsDone("fechaEnd");
                      }}
                    >
                      Fecha Que Se Reparo
                      {arrow.campus == "fechaEnd" ? (
                        renderIconArrowIsDone(orderByDateDoneMistake)
                      ) : (
                        <></>
                      )}
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.slice(start, end).map((elem) => {
                    const boolean =
                      elem.isSolved >= 1 ? "Completo" : "Incompleto";
                    return (
                      <tr
                        className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                        key={elem.id}
                        onClick={() => {setIndex(elem)}}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {elem.cod_matriz}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.descripcion_deterioro}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.categoria}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.fecha}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 font-bold text-center ${
                            elem.isSolved >= 1
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {boolean}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          {elem.fechaTerminado}
                        </td>
                        <td className={`whitespace-nowrap px-6 py-4`}>
                          {elem.isSolved >= 1 ? (
                            <Tooltip
                              title="Marcar como Incompleto"
                              onClick={() => handleUpdateIsDone(elem.id, false)}
                            >
                              <IconButton size="small">
                                <FaXmark className="cursor-pointer hover:text-red-400 " />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title="Marcar como Completo"
                              onClick={() => handleUpdateIsDone(elem.id, true)}
                            >
                              <IconButton size="small">
                                <FaCheck className="cursor-pointer hover:text-green-400 " />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip
                            title="Actualizar"
                            onClick={() => {
                              setIndex(elem);
                              setDialogUpdate(true);
                            }}
                          >
                            <IconButton size="small">
                              <FaPen className="cursor-pointer hover:text-blue-400 " />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title="Eliminar"
                            onClick={() => {
                              setIndex(elem);
                              setDialogDelete(true);
                            }}
                          >
                            <IconButton size="small">
                              <BiTrashAlt className="cursor-pointer hover:text-red-400 " />
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
      <DialogUpdateHistorialErroresMatrices
        show={dialogUpdate}
        close={() => {
          setDialogUpdate(false);
        }}
        index={index}
      />
      <Dialog open={dialogDelete} onClose={() => setDialogDelete(false)}>
        <DialogTitle>Eliminar Historial</DialogTitle>
        <DialogContent>Estas seguro en eliminar ?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogDelete(false)} variant="text">
            Cancelar
          </Button>
          <Button onClick={handleDeleteItem} variant="outlined">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
