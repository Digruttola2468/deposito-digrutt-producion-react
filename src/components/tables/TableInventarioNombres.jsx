import { IconButton, Pagination, TextField, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import SearchClientesBox from "../comboBox/SearchClientesBox";
import { CiSquarePlus } from "react-icons/ci";
import PostRemito from "../form/PostRemito";
import { FiTrash } from "react-icons/fi";
import PostNotaEnvio from "../form/PostNotaEnvio";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function TableInventarioNombres({type}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const { data, error, isLoading } = useSWR(
    [`${BASE_URL}/inventario/nombres`, userSupabase.token],
    fetcherToken,
    {
      onSuccess: (data, key, conf) => {
        setTable(data);
      },
    }
  );

  const [listInventarioSelects, setListInventarioSelects] = useState([]);

  const [table, setTable] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const getPrevius = () => {
    resetTable();
    setTable(data);
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] place-content-center">
        <div className="flex flex-col lg:justify-center lg:items-center ">
          <div className="flex flex-row items-center">
            <TextField
              label="Buscar Descripcion"
              size="small"
              onChange={(evt) => {
                const text = evt.target.value;
                if (text != "") {
                  const filterByDescripcion = data.filter((elem) => {
                    return elem.descripcion
                      .toLowerCase()
                      .includes(text.toLowerCase());
                  });
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
                        Descripcion
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Stock Actual
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.slice(start, end).map((elem) => {
                      const stockActual = elem.entrada - elem.salida;
                      const isSelected =
                        listInventarioSelects.find(
                          (list) => list.id == elem.id
                        ) != null
                          ? true
                          : false;
                      return (
                        <tr
                          className={`border-b dark:border-neutral-500 hover:bg-blue-20 ${
                            isSelected && "bg-green-400"
                          } hover:text-neutral-800`}
                          key={elem.id}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {elem.descripcion}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {elem.cliente}
                          </td>
                          <td className={`whitespace-nowrap px-6 py-4 font-mono`}>
                            {stockActual}
                          </td>
                          <td>
                            {!isSelected ? (
                              <Tooltip
                                onClick={() => {
                                  if (!isSelected) {
                                    setListInventarioSelects([
                                      ...listInventarioSelects,
                                      elem,
                                    ]);
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
                                    const filter = listInventarioSelects.filter(
                                      (list) => list.id != elem.id
                                    );
                                    setListInventarioSelects(filter);
                                  }
                                }}
                              >
                                <IconButton className="hover:text-red-400">
                                  <FiTrash />
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
              count={Math.ceil(table.length / 10)}
              onChange={(evt, value) => {
                const end = 10 * parseInt(value);
                setEnd(end);
                setStart(end - 10);
              }}
            />
          </div>
        </div>
        {type == "remito" && <PostRemito
          listInventario={listInventarioSelects}
          setListInventario={setListInventarioSelects}
        />}
        {type == "notaEnvio" && <PostNotaEnvio
          listInventario={listInventarioSelects}
          setListInventario={setListInventarioSelects}
        />}

      </section>
    </>
  );
}
