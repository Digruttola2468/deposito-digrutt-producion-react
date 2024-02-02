import { useContext, useState } from "react";
import { EnviosContext } from "../../context/EnviosContext";
import {
  Divider,
  IconButton,
  Pagination,
  TextField,
  Tooltip,
} from "@mui/material";
import { IoRefresh } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { FaPen } from "react-icons/fa";
import { BiTrashAlt } from "react-icons/bi";

export default function TableEnvios() {
  const { table,setIndex,index } = useContext(EnviosContext);

  const [dialogNewEnvio, setDialogNewEnvio] = useState(false);
  const [dialogUpdate, setDialogUpdate] = useState(false);
  const [dialogDelete, setDialogDelete] = useState(false);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  return (
    <section className="grid grid-cols-1  place-content-center mt-4">
      <Divider>
        <div className="flex flex-row items-center">
          <h1 className="uppercase text-center my-2 font-bold text-lg">
            TABLA ENVIOS
          </h1>
          <span
            className="mx-2 cursor-pointer"
            onClick={() => {
              mutate();
            }}
          >
            <IoRefresh />
          </span>
        </div>
      </Divider>
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div className="flex flex-row items-center">
          <TextField size="small" type="date" />
          <Tooltip title="Nuevo Envio">
            <IconButton
              className="hover:text-blue-700"
              onClick={() => setDialogNewEnvio(true)}
            >
              <CiSquarePlus />
            </IconButton>
          </Tooltip>
        </div>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden ">
              <table className="min-w-full text-left text-sm font-light ">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Auto
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Ubicacion
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Descripcion
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Hora
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Actions
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
                          {elem.marca}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.ubicacion}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.descripcion}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          {elem.hora}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {elem.fecha}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Tooltip
                            onClick={() => {
                              setIndex(elem);
                              setDialogUpdate(true);
                            }}
                          >
                            <IconButton
                              size="small"
                              className="hover:text-blue-400"
                            >
                              <FaPen />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            onClick={() => {
                              setIndex(elem);
                              setDialogDelete(true);
                            }}
                          >
                            <IconButton
                              size="small"
                              className="hover:text-red-400"
                            >
                              <BiTrashAlt />
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
    </section>
  );
}
