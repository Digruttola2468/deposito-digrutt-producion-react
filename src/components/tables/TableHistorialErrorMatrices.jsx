import { Divider, Pagination } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import useSWR from "swr";

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
  const { userSupabase, BASE_URL } = useContext(UserContext);
  const { data, isLoading, error, mutate } = useSWR(
    [`${BASE_URL}/historialMatriz`, userSupabase.token],
    fetcherToken
  );

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  useEffect(() => {
    setStart(end - 10)
  }, [end])

  const getPrevius = () => {
    //setTable(data);
  }

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };
  if (isLoading) return <></>
  if (error) return <></>

  console.log(data);

  return (
    <section>
        <Divider><h1 className="uppercase font-bold text-lg">Table Historial</h1></Divider>
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden ">
              <table className="min-w-full text-left text-sm font-light ">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Cod Matriz
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Descripcion Matriz
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Descripcion Falla
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Esta Reparado?
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Fecha Que se Reparo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(start, end).map((elem) => {
                    const boolean = elem.isSolved >= 1 ? "Verdadero" : "Falso";
                    return (
                      <tr
                        className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                        key={elem.id}
                        onClick={() => setIndex(elem.id)}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {elem.cod_matriz}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.descripcion}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.descripcion_deterioro}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.fecha}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          {boolean}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          {elem.fechaTerminado}
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
            count={Math.ceil(data.length / 10)}
            onChange={(evt, value) => {
              setEnd(10 * parseInt(value));
            }}
          />
        </div>
      </div>
    </section>
  );
}
