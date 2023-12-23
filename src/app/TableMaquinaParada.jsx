import { Pagination } from "@mui/material";
import { useContext, useState } from "react";
import { MaquinaParadaContext } from "../context/MaquinaParadaContext";

export default function TableMaquinaParada() {
  const { tableOriginal } = useContext(MaquinaParadaContext);

  const [index, setIndex] = useState(null);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  return (
    <div className="flex flex-col  lg:justify-center lg:items-center ">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full sm:max-w-[1000px] py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden ">
            <table className="min-w-full text-left text-sm font-light ">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Maquina
                  </th>
                  <th scope="col" className="px-6 py-4">
                    N° Maquina
                  </th>

                  <th scope="col" className="px-6 py-4">
                    Hrs Parada
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Motivo Maquina Parada
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableOriginal.slice(start, end).map((elem, index) => {
                  return (
                    <tr
                      className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                      key={index}
                      onClick={() => setIndex(elem.id)}
                    >
                      <td className="whitespace-nowrap px-6 py-4  font-medium">
                        {elem.nombre}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {elem.numberSerie}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {elem.hrs}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 ">
                        {elem.descripcion}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 ">
                        {elem.fecha}
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
  );
}
