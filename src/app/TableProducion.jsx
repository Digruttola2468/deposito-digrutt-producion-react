import { Pagination, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { ProducionContext } from "../context/ProduccionContext";

export default function TableProducion() {
  const { tableOriginal } = useContext(ProducionContext);

  const [index, setIndex] = useState(null);

  const [table,setTable] = useState(() => tableOriginal)

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const getPrevius = () => {
    setTable(tableOriginal);
  }

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  return (
    <div className="flex flex-col lg:justify-center lg:items-center ">
      <TextField
        label="Buscar Descripcion"
        size="small"
        onChange={(evt) => {
          const text = evt.target.value;
          if (text != "") {
            const filterByDescripcion = tableOriginal.filter((elem) => {
              return elem.descripcion.toLowerCase().includes(text.toLowerCase());
            });
            setTable(filterByDescripcion)
          } else getPrevius();

        }}
      />
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
                    Descripcion
                  </th>
                  <th scope="col" className="px-6 py-4">
                    N° Maquina
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Golpes Reales
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Piezas Producidas
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Promedio Golpes/hr
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.slice(start, end).map((elem) => {
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
                        {elem.num_maquina}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {elem.golpesReales}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 ">
                        {elem.piezasProducidas}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 ">
                        {elem.prom_golpeshora}
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
