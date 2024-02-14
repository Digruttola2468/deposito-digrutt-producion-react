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
import { useContext, useState } from "react";
import { PedidosContext } from "../../context/PedidosContext";
import {
  FaCheck,
  FaLongArrowAltDown,
  FaLongArrowAltUp,
  FaPen,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import DialogNewPedidos from "../dialog/DialogNewPedidos";
import { CiSquarePlus } from "react-icons/ci";
import toast from "react-hot-toast";
import { BiTrashAlt } from "react-icons/bi";
import DialogUpdatePedido from "../dialog/DialogUpdatePedido";
import { TbPdf } from "react-icons/tb";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrdenCompraA4PDF from "../pdf/OrdenCompraA4PDF";

export default function TablePedidos() {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const {
    apiOriginal,
    updateIsDone,
    deleteTable,
    table,
    setTable,
    index,
    setIndex,
    ordenCompra, 
    setOrdenCompra
  } = useContext(PedidosContext);

  const [arrow, setArrow] = useState({ order: "ASC", campus: null });

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const [dialogNewPedido, setDialogNewPedido] = useState(false);
  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);

  const getPrevius = () => {
    resetTable();
    setTable(apiOriginal);
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  const handleUpdateIsDone = (idPedido, isDone) => {
    const value = isDone ? "1" : "0";
    toast.promise(
      axios
        .put(
          `${BASE_URL}/pedidos/${idPedido}/doneStock`,
          {
            isDone: value,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          updateIsDone(idPedido, isDone);
        }),
      {
        loading: "Creando Pedido...",
        success: "Operacion Exitosa",
        error: (err) => {
          console.log(err);
          return "Ocurrio un Error";
        },
      }
    );
  };

  const handleDelete = () => {
    toast.promise(
      axios
        .delete(`${BASE_URL}/pedidos/${index.id}`, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          deleteTable(index.id);
          setDialogDelete(false);
        }),
      {
        loading: "Eliminando Pedido...",
        success: "Operacion Exitosa",
        error: (err) => {
          return "Ocurrio un Error";
        },
      }
    );
  };

  const handleOrderIsDone = (campus) => {
    setArrow({ campus, order: arrow.order == "ASC" ? "DESC" : "ASC" });
  };

  //Order Table
  const orderByIsDone = (value) => {
    if (value == "ASC") {
      table.sort(function (a, b) {
        if (a.is_done < b.is_done) return 1;

        if (a.is_done > b.is_done) return -1;

        return 0;
      });
    }
    if (value == "DESC") {
      table.sort(function (a, b) {
        if (a.is_done > b.is_done) return 1;

        if (a.is_done < b.is_done) return -1;

        return 0;
      });
    }
  };

  const orderByDate = (value) => {
    if (value == "ASC") {
      table.sort((a, b) => {
        return new Date(b.fecha_entrega) - new Date(a.fecha_entrega);
      });
    }
    if (value == "DESC") {
      table.sort((a, b) => {
        return new Date(a.fecha_entrega) - new Date(b.fecha_entrega);
      });
    }
  };

  const orderCantidadEnviar = (value) => {
    if (value == "ASC") {
      table.sort((a, b) => {
        if (a.stock > b.stock) return 1;

        if (a.stock < b.stock) return -1;

        return 0;
      });
    }
    if (value == "DESC") {
      table.sort((a, b) => {
        if (a.stock < b.stock) return 1;

        if (a.stock > b.stock) return -1;

        return 0;
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
    <>
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div className="flex flex-row flex-wrap gap-1">
          <TextField
            label="Buscar Orden Compra"
            size="small"
            value={ordenCompra}
            onChange={(evt) => {
              const text = evt.target.value;
              setOrdenCompra(text)
              if (text != "") {
                const filterByDescripcion = apiOriginal.filter((elem) => {
                  return elem.ordenCompra
                    .toLowerCase()
                    .includes(text.toLowerCase());
                });
                setTable(filterByDescripcion);
              } else getPrevius();
            }}
          />
          <TextField
            size="small"
            type="date"
            sx={{ minWidth: "100px" }}
            onChange={(evt) => {
              const fecha = evt.target.value;
              if (fecha != "") {
                const filterByDescripcion = apiOriginal.filter((elem) => {
                  return elem.fecha_entrega == fecha;
                });
                if (filterByDescripcion.length != 0) {
                  resetTable();
                  setTable(filterByDescripcion);
                } else toast.error("No hay datos");
              } else getPrevius();
            }}
          />
          <Tooltip title="Nuevo Pedido">
            <IconButton
              className="hover:text-blue-700"
              onClick={() => setDialogNewPedido(true)}
            >
              <CiSquarePlus />
            </IconButton>
          </Tooltip>
          <Tooltip title="Crear PDF">
            <IconButton className="hover:text-red-500 cursor-pointer transition-all duration-300">
              <PDFDownloadLink
                document={
                  <OrdenCompraA4PDF
                    list={table}
                    ordenCompra={ordenCompra}
                  />
                }
                fileName={`${ordenCompra}.pdf`}
              >
                <TbPdf  />
              </PDFDownloadLink>
            </IconButton>
          </Tooltip>
        </div>

        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden ">
              <table className="min-w-full text-left text-sm font-light ">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-center">
                      Articulo
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Descripcion
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-4 text-center">
                      Orden Compra
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-4 text-center relative text-green-500`}
                      onClick={() => {
                        handleOrderIsDone("cantEnviar");
                      }}
                    >
                      Cantidad Enviar
                      {arrow.campus == "cantEnviar" ? (
                        renderIconArrowIsDone(orderCantidadEnviar)
                      ) : (
                        <></>
                      )}
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-4 text-center relative text-blue-500`}
                    >
                      Cantidad Enviada
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-4 text-center relative text-red-500`}
                    >
                      Pendiente Entrega
                    </th>
                    <th
                      scope="col"
                      className={`px-6 py-4 text-center relative`}
                      onClick={() => {
                        handleOrderIsDone("fechaEntrega");
                      }}
                    >
                      Fecha Entrega
                      {arrow.campus == "fechaEntrega" ? (
                        renderIconArrowIsDone(orderByDate)
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
                      Pedido Terminado?
                      {arrow.campus == "isDone" ? (
                        renderIconArrowIsDone(orderByIsDone)
                      ) : (
                        <></>
                      )}
                    </th>
                    <th scope="col" className={"px-6 py-4 text-center"}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.slice(start, end).map((elem) => {
                    const stringIsDone =
                      elem.is_done >= 1 ? "Completo" : "Incompleto";
                    const pendienteEntrega =
                      elem.cantidadEnviar - elem.cantidad_enviada;
                    return (
                      <tr
                        className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                        key={elem.id}
                        onClick={() => setIndex(elem)}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-center">
                          {elem.nombre}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {elem.descripcion}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {elem.cliente}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {elem.ordenCompra}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {elem.cantidadEnviar}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {elem.cantidad_enviada}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {pendienteEntrega}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {elem.fecha_entrega}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-4 ${
                            elem.is_done >= 1
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {stringIsDone}
                        </td>
                        <td className={`whitespace-nowrap px-6 py-4`}>
                          {elem.is_done >= 1 ? (
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
      <DialogNewPedidos
        show={dialogNewPedido}
        close={() => setDialogNewPedido(false)}
      />
      <DialogUpdatePedido
        show={dialogUpdate}
        index={index}
        close={() => setDialogUpdate(false)}
      />
      <Dialog open={dialogDelete} onClose={() => setDialogDelete(false)}>
        <DialogTitle>Eliminar Pedido</DialogTitle>
        <DialogContent>Estas seguro en eliminar el pedido ?</DialogContent>
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
