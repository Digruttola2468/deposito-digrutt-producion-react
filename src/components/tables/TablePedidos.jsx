import { IconButton, Pagination, TextField, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PedidosContext } from "../../context/PedidosContext";
import { FaCheck, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";
import { UserContext } from "../../context/UserContext";

export default function TablePedidos() {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { tableOriginal, updateIsDone } = useContext(PedidosContext);

  const [index, setIndex] = useState(null);

  const [table, setTable] = useState(() => tableOriginal);

  const [arrow, setArrow] = useState({ order: "ASC", campus: null });

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  useEffect(() => {
    setStart(end - 10);
  }, [end]);

  const getPrevius = () => {
    resetTable();
    setTable(tableOriginal);
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  const handleUpdateIsDone = (idPedido, isDone) => {
    const value = isDone ? "1" : "0";
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
        console.log(result.data.message);
        setTable(updateIsDone(idPedido, isDone));
      })
      .catch((e) => {
        console.log(e);
      });
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

      if (arrow.order == "ASC") return <FaLongArrowAltDown className="absolute right-0 bottom-5" />;
      else if (arrow.order == "DESC")
        return <FaLongArrowAltUp className="absolute right-0 bottom-5" />;
    }

    return <></>;
  };

  return (
    <>
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div>
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
                    <th
                      scope="col"
                      className={`px-6 py-4 text-center relative`}
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
                    return (
                      <tr
                        className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                        key={elem.id}
                        onClick={() => setIndex(elem.id)}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {elem.nombre}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.descripcion}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.cliente}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.stock}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
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
    </>
  );
}