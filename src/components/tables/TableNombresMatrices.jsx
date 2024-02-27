import { useContext, useState } from "react";
import { PostMatricesContext } from "../../context/PostMatricesContext";
import SearchClientesBox from "../comboBox/SearchClientesBox";
import { IconButton, Pagination, TextField, Tooltip } from "@mui/material";
import { FiTrash } from "react-icons/fi";
import { CiSquarePlus } from "react-icons/ci";

export default function TableNombresMatrices({ elements = <></> }) {
  const {
    apiOriginal,
    table,
    setTable,
    listMatrices,
    setListMatrices,
    cliente,
    setCliente,
  } = useContext(PostMatricesContext);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const getPrevius = () => {
    resetTable();
    if (cliente != null && cliente != "") {
      const filterByCliente = apiOriginal.filter((elem) => elem.idcliente == cliente);
      setTable(filterByCliente);
    } else setTable(apiOriginal);
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] place-content-center mt-10">
        <div className="flex flex-col lg:justify-center lg:items-center ">
          <div className="flex flex-row items-center">
            <TextField
              label="Buscar Descripcion"
              size="small"
              onChange={(evt) => {
                const text = evt.target.value;
                if (text != "") {
                  if (cliente != "" && cliente != null) {
                    const filterByCliente = apiOriginal.filter(
                      (elem) => elem.idcliente == cliente
                    );
                    const filterByDescripcion = filterByCliente.filter(
                      (elem) => {
                        return elem.descripcion
                          .toLowerCase()
                          .includes(text.toLowerCase());
                      }
                    );
                    setTable(filterByDescripcion);
                  } else {
                    const filterByDescripcion = apiOriginal.filter((elem) => {
                      return elem.descripcion
                        .toLowerCase()
                        .includes(text.toLowerCase());
                    });
                    setTable(filterByDescripcion);
                  }
                } else getPrevius();
              }}
            />
            <SearchClientesBox
              filterTable={setTable}
              table={table}
              refresh={() => {
                setTable(apiOriginal);
              }}
              apiOriginal={apiOriginal}
              setCliente={setCliente}
            />
          </div>
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden ">
                <table className="min-w-full text-left text-sm font-light ">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-2 py-4"></th>
                      <th scope="col" className="px-6 py-4">
                        Descripcion
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-4">
                        N° Matriz
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.slice(start, end).map((elem) => {
                      const isSelected =
                        listMatrices.find((list) => list.id == elem.id) != null
                          ? true
                          : false;
                      return (
                        <tr
                          className={`border-b dark:border-neutral-500 hover:bg-blue-20 ${
                            isSelected && "bg-green-400"
                          } hover:text-neutral-800`}
                          key={elem.id}
                        >
                          <td>
                            {!isSelected ? (
                              <Tooltip
                                onClick={() => {
                                  if (!isSelected) {
                                    setListMatrices([...listMatrices, elem]);
                                  }
                                }}
                              >
                                <IconButton className="hover:text-blue-400">
                                  <CiSquarePlus />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip
                                onClick={() => {
                                  if (isSelected) {
                                    const filter = listMatrices.filter(
                                      (list) => list.id != elem.id
                                    );
                                    setListMatrices(filter);
                                  }
                                }}
                              >
                                <IconButton className="hover:text-red-400">
                                  <FiTrash />
                                </IconButton>
                              </Tooltip>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {elem.descripcion}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.cliente}
                          </td>
                          <td
                            className={`whitespace-nowrap px-6 py-4 font-mono`}
                          >
                            {elem.numero_matriz}
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
                const end = 10 * parseInt(value);
                setEnd(end);
                setStart(end - 10);
              }}
            />
          </div>
        </div>
        {elements}
      </section>
    </>
  );
}
