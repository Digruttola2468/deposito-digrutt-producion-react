import {
  Alert,
  Button,
  Pagination,
  Slide,
  Snackbar,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MaquinaParadaContext } from "../context/MaquinaParadaContext";
import PostMaquinaParada from "../components/form/PostMaquinaParada";

export default function TableMaquinaParada() {
  const { tableOriginal } = useContext(MaquinaParadaContext);

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
    <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] place-content-center">
      <div className="flex flex-col lg:justify-center lg:items-center ">
        <div className="flex flex-col md:flex-row justify-self-start items-center">
          <div className="flex flex-row items-center">
            <span className="pr-1">Empieza</span>
            <TextField
              type="date"
              value={startFecha}
              onChange={(evt) => {
                const fechaString = evt.target.value;
                setStartFecha(fechaString);
                if (fechaString != "") {
                  const filterDate = tableOriginal.filter(
                    (elem) => new Date(elem.fecha) >= new Date(fechaString)
                  );
                  if (filterDate.length == 0) {
                    setOpenDialog({
                      done: true,
                      message: "No hay datos",
                      error: true,
                    });
                  } else {
                    setTable(filterDate);
                    resetTable();
                  }
                } else getPreviuos();
              }}
              sx={{ width: "150px" }}
            />
          </div>
          <div className="flex flex-row items-center mt-2">
            <span className="pr-1">Termina</span>
            <TextField
              type="date"
              value={endFecha}
              onChange={(evt) => {
                const fechaString = evt.target.value;
                setEndFecha(fechaString);
                if (fechaString != "") {
                  const filterDate = tableOriginal.filter(
                    (elem) => new Date(elem.fecha) <= new Date(fechaString)
                  );
                  if (filterDate.length == 0) {
                    setOpenDialog({
                      done: true,
                      message: "No hay datos",
                      error: true,
                    });
                  } else {
                    setTable(filterDate);
                    resetTable();
                  }
                } else getPreviuos();
              }}
              sx={{ width: "150px" }}
            />
          </div>
          <Button
            onClick={() => {
              resetTable();
              getPreviuos();
              setEndFecha("");
              setStartFecha("");
            }}
          >
            Borrar
          </Button>
        </div>

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
                  {table.slice(start, end).map((elem, index) => {
                    return (
                      <tr
                        className={`border-b dark:border-neutral-500 hover:border-info-200 hover:bg-red-200 hover:text-neutral-800`}
                        key={index}
                        onClick={() => setIndex(elem.id)}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
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
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={Slide}
          open={openDialog.done}
          autoHideDuration={5000}
          onClose={() =>
            setOpenDialog({ done: false, error: openDialog.error })
          }
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
      <div>
        <PostMaquinaParada />
      </div>
    </section>
  );
}
