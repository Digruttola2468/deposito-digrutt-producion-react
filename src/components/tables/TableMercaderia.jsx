import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import useSWR from "swr";
import { InputAdornment, Pagination, TextField } from "@mui/material";
import SearchClientesBox from "../comboBox/SearchClientesBox";
import ItemTableOficina from "../ItemsTables/ItemTableOficina";
import ItemTableMercaderia from "../ItemsTables/ItemTableMercaderia";
import PostMercaderia from "../form/PostMercaderia";

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
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/mercaderia`, userSupabase.token],
    fetcher,
    { onSuccess: (data, key, config) => setTable(data) }
  );

  const [table, setTable] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [index, setIndex] = useState(null);

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
                    </tr>
                  </thead>
                  <tbody>
                    {table.slice(start, end).map((elem) => {
                      return (
                        <tr
                          className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-cyan-200 hover:text-neutral-800`}
                          key={elem.id}
                          onClick={() => {
                            setIndex(elem.id);
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
        <div className="flex flex-col lg:flex-col items-center justify-start">
          <div className="block rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 border lg:mx-5 mx-1 mt-2">
            {index != null && (
              <ItemTableMercaderia index={index} refreshTableOficina={mutate} />
            )}
          </div>
          <PostMercaderia refreshTable={mutate}/>
        </div>
      </section>
    </>
  );
}
