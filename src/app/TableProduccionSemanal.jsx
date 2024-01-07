import { useContext } from "react";
import useSWR from "swr";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function TableProduccionSemanal({ rangeDate, numMaquina }) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { data, isLoading, error } = useSWR(
    [
      `${BASE_URL}/producion/${numMaquina}?init=${rangeDate[0]}&end=${rangeDate[1]}`,
      userSupabase.token,
    ],
    fetcherToken
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <>
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full  py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden ">
              <table className="min-w-full text-left text-sm font-light ">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-2 py-4">
                      Articulo
                    </th>
                    <th scope="col" className="px-2 py-4">
                      Fecha
                    </th>
                    <th scope="col" className="px-2 py-4">
                      Golpes Reales
                    </th>
                    <th scope="col" className="px-2 py-4">
                      Piezas Producidas
                    </th>
                    <th scope="col" className="px-2 py-4">
                      Promedio Golpes/hr
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((elem) => {
                    return (
                      <tr
                        className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                        key={elem.id}
                      >
                        <td className="whitespace-nowrap py-4 font-medium">
                          {elem.nombre}
                        </td>
                        <td className="whitespace-nowrap  py-4">
                          {elem.fecha}
                        </td>
                        <td className="whitespace-nowrap  py-4">
                          {elem.golpesReales}
                        </td>
                        <td className="whitespace-nowrap  py-4 ">
                          {elem.piezasProducidas}
                        </td>
                        <td className="whitespace-nowrap py-4 ">
                          {elem.prom_golpeshora}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
