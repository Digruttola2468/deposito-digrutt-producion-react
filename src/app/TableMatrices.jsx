import {
  Alert,
  Button,
  Pagination,
  Slide,
  Snackbar,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MatricesContext } from "../context/MatricesContext";

export default function TableMatrices() {
  const { tableOriginal } = useContext(MatricesContext);

  const [index, setIndex] = useState(null);

  const [table, setTable] = useState(() => tableOriginal);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const [startFecha, setStartFecha] = useState("");
  const [endFecha, setEndFecha] = useState("");

  const [openDialog, setOpenDialog] = useState({
    done: false,
    message: "Operacion Exitosa!",
    error: null,
  });

  useEffect(() => {
    setStart(end - 10);
  }, [end]);

  const getPreviuos = () => {
    setTable(tableOriginal);
  };

  const resetTable = () => {
    setStart(0);
    setEnd(10);
  };

  return (
    <div className="flex flex-col lg:justify-center lg:items-center ">
      <div>
        <TextField label="Buscar Descripcion" size="small" onChange={(evt) => {
          const text = evt.target.value;
          if (text != "") {
            const filter = tableOriginal.filter((elem) => {
              return elem.descripcion.toLowerCase().includes(text.toLowerCase());
            })
            setTable(filter)
          }else getPreviuos();
        }} />
      </div>
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full sm:max-w-[1000px] py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden ">
            <table className="min-w-full text-left text-sm font-light ">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Cod Matriz
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Descripcion
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Cant Pieza x Golpe
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Material
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Numero Matriz
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.slice(start, end).map((elem, index) => {
                  return (
                    <tr
                      className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                      key={index}
                      onClick={() => setIndex(elem.id)}
                    >
                      <td className="whitespace-nowrap px-6 py-4  font-medium">
                        {elem.cod_matriz}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {elem.descripcion}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {elem.cantPiezaGolpe}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 ">
                        {elem.cliente}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 ">
                        {elem.material}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 ">
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
          count={Math.ceil(tableOriginal.length / 10)}
          onChange={(evt, value) => {
            setEnd(10 * parseInt(value));
          }}
        />
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={Slide}
        open={openDialog.done}
        autoHideDuration={5000}
        onClose={() => setOpenDialog({ done: false, error: openDialog.error })}
      >
        <Alert
          onClose={() =>
            setOpenDialog({ done: false, error: openDialog.error })
          }
          severity={openDialog.error != null ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {openDialog.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
