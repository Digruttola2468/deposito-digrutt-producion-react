import { Pagination, TextField } from "@mui/material";
import SearchClientesBox from "../comboBox/SearchClientesBox";
import ItemTableNotaEnvio from "../ItemsTables/ItemTableNotaEnvio";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import { NotaEnvioContext } from "../../context/NotaEnvioContext";

export default function TableNotaEnvios() {
  const {
    table,
    setTable,
    setIndex,
    index,
    apiOriginal: data,
  } = useContext(NotaEnvioContext);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const getPrevius = () => {
    setTable(data);
    resetTable();
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  return (
    <section className="grid grid-cols-1 justify-center items-center mt-4">
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div className="flex flex-row items-center">
          <TextField
            label="Buscar Nota Envio"
            size="small"
            onChange={(evt) => {
              const text = evt.target.value;
              if (text != "") {
                const filterByDescripcion = data.filter((elem) => {
                  return new String(elem.nro_envio).includes(text);
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
                      Nota Envio
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Valor Total Declarado
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
                          setIndex(elem);
                        }}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {elem.nro_envio}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.fecha}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.cliente}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          {elem.valorDeclarado == 0
                            ? ""
                            : `$${elem.valorDeclarado}ARG`}
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
      {index != null && <ItemTableNotaEnvio />}
    </section>
  );
}
