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
import { MaquinaParadaContext } from "../../context/MaquinaParadaContext";

export default function PostMaquinaParada() {
  const { token, base_url, fetcherToken, refreshTable } =
    useContext(MaquinaParadaContext);

  const { data, isLoading, error } = useSWR(
    [`${base_url}/motivoMaquinaParada`, token],
    fetcherToken
  );

  const [openDialog, setOpenDialog] = useState({
    done: false,
    message: "Operacion Exitosa!",
    error: null,
  });

  const [motivoMaquina, setMotivoMaquina] = useState(null);
  const [hrs, setHrs] = useState("");
  const [numMaquina, setNumMaquina] = useState("");
  const [fecha, setFecha] = useState("");

  const handleClickSend = (evt) => {
    evt.preventDefault();
    const enviar = {
      idMotivoMaquinaParada: motivoMaquina.id,
      hrs,
      idMaquina: numMaquina,
      fecha,
    };

    axios
      .post(`${base_url}/maquinaParada`, enviar, {
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

  const empty = (evt) => {
    evt.preventDefault();
    setMotivoMaquina(null);
    setFecha("");
    setHrs("");
    setNumMaquina("");
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <>
      <Divider><h1 className="uppercase font-bold text-2xl">Agregar Maquina Parada</h1></Divider> 
      <form className="flex flex-col">
        <div className="flex flex-row">
          <TextField
            type="number"
            value={numMaquina}
            onChange={(evt) => setNumMaquina(evt.target.value)}
            label="N° Maquina"
            sx={{ margin: 1 }}
          />
          <Autocomplete
            sx={{ margin: 1, width: "100%" }}
            options={data}
            getOptionLabel={(elem) => elem.descripcion}
            value={motivoMaquina}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(evt, value) => {
              console.log(value);
              setMotivoMaquina(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Maq Parada" variant="outlined" />
            )}
          />
        </div>

        <div>
          <TextField
            type="date"
            value={fecha}
            onChange={(evt) => setFecha(evt.target.value)}
            sx={{ margin: 1 }}
          />
          <TextField
            type="number"
            value={hrs}
            onChange={(evt) => setHrs(evt.target.value)}
            label="Hrs Maquina Parada"
            sx={{ margin: 1 }}
          />
        </div>

        <Button type="submit" variant="text" onClick={empty}>
          Borrar
        </Button>
        <Button type="submit" variant="outlined" onClick={handleClickSend}>
          Enviar
        </Button>
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
