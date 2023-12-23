import {
  Alert,
  Autocomplete,
  Button,
  Divider,
  Slide,
  Snackbar,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import useSWR from "swr";
import { ProducionContext } from "../../context/ProduccionContext";

export default function PostProduccion() {
  const { token, base_url, fetcherToken, refreshTable } =
    useContext(ProducionContext);

  const { data, isLoading, error } = useSWR(
    [`${base_url}/inventario/nombres`, token],
    fetcherToken
  );

  const [openDialog, setOpenDialog] = useState({
    done: false,
    message: "Operacion Exitosa!",
    error: null,
  });

  const [numMaquina, setNumMaquina] = useState("");
  const [fecha, setFecha] = useState("");
  const [codProducto, setCodProducto] = useState(null);
  const [golpesReales, setGolpesReales] = useState("");
  const [piezasProducidas, setPiezasProducidas] = useState("");
  const [promGolpesHora, setPromGolpesHora] = useState("");

  const handleClickSend = (evt) => {
    evt.preventDefault();
    const enviar = {
      numMaquina,
      fecha,
      idInventario: parseInt(codProducto.id),
      golpesReales,
      piezasProducidas,
      promGolpesHora: parseInt(promGolpesHora),
    };

    axios
      .post(`${base_url}/producion`, enviar, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result);
        setOpenDialog({ done: true, message: "Operacion Exitosa!" });
        refreshTable();
      })
      .catch((error) => {
        console.log(error);
        setOpen({
          done: true,
          message: error.response.data.message,
          error: true,
        });
      });
  };

  const empty = () => {
    setCodProducto(null);
    setFecha("");
    setGolpesReales("");
    setNumMaquina("");
    setPiezasProducidas("");
    setPromGolpesHora("");
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <>
      <Divider>
        <h1 className="uppercase text-2xl font-bold">Agregar Producion</h1>
      </Divider>
      <form className="flex flex-col max-w-[500px]">
        <div>
          <TextField
            type="number"
            value={numMaquina}
            onChange={(evt) => setNumMaquina(evt.target.value)}
            label="N° Maquina"
            sx={{ margin: 1 }}
          />
          <TextField
            type="date"
            value={fecha}
            onChange={(evt) => setFecha(evt.target.value)}
            sx={{ margin: 1 }}
          />
        </div>
        <div>
          <Autocomplete
            sx={{ margin: 1, maxWidth: "350px" }}
            options={data}
            getOptionLabel={(elem) => elem.nombre}
            value={codProducto}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(evt, value) => {
              console.log(value);
              setCodProducto(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Cod Producto" variant="outlined" />
            )}
          />
        </div>
        <div>
          <TextField
            type="number"
            value={golpesReales}
            onChange={(evt) => setGolpesReales(evt.target.value)}
            label="Golpes Reales"
            sx={{ margin: 1 }}
          />
          <TextField
            type="number"
            value={piezasProducidas}
            onChange={(evt) => setPiezasProducidas(evt.target.value)}
            label="Piezas Producidas"
            sx={{ margin: 1 }}
          />
        </div>
        <div>
          <TextField
            type="number"
            value={promGolpesHora}
            onChange={(evt) => setPromGolpesHora(evt.target.value)}
            label="Promedio Golpes/hr"
            sx={{ margin: 1 }}
          />
        </div>
        <div className="flex flex-row justify-between">
          <Button type="submit" variant="text" onClick={empty}>
            Borrar
          </Button>
          <Button type="submit" variant="outlined" onClick={handleClickSend}>
            Enviar
          </Button>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={Slide}
          open={openDialog.done}
          autoHideDuration={6000}
          onClose={() => setOpenDialog({ done: false })}
        >
          <Alert
            onClose={() => setOpenDialog({ done: false })}
            severity={openDialog.error != null ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {openDialog.message}
          </Alert>
        </Snackbar>
      </form>
    </>
  );
}
