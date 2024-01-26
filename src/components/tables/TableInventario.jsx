import { useContext,  useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import useSWR from "swr";
import {
  IconButton,
  Pagination,
  TextField,
  Tooltip,
} from "@mui/material";
import SearchClientesBox from "../comboBox/SearchClientesBox";
import { FaPen } from "react-icons/fa";
import DialogUpdateInventario from "../dialog/DialogUpdateInventario";

const fetcher = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function TableInventario() {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/inventario`, userSupabase.token],
    fetcher,
    { onSuccess: (data, key, config) =>  setTable(data) }
  );

  const [table, setTable] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [index, setIndex] = useState(null);

  const [dialogUpdate, setDialogUpdate] = useState(false);

  const getPrevius = () => {
    setTable(data);
    resetTable();
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <>
      <section className="grid grid-cols-1  place-content-center mt-4">
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
                              <IconButton size="small" className="hover:text-blue-400">
                                <FaPen />
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
          refreshTable={mutate}
          index={index}
        />
      </section>
    </>
  );
}
