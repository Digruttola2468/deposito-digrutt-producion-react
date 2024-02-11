import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { EnviosContext } from "../../context/EnviosContext";
import BoxVehiculos from "../comboBox/BoxVehiculos";
import BoxLocalidad from "../comboBox/BoxLocalidad";

export default function DialogUpdateEnvio({
  show = false,
  close = () => {},
  index,
}) {
  const { userSupabase, BASE_URL } = useContext(UserContext);
  const { updateTable } = useContext(EnviosContext);

  const { data, isLoading, error, mutate } = useSWR(
    `${BASE_URL}/vehiculos`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  const [vehiculo, setVehiculo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaDate, setFechaDate] = useState("");

  useEffect(() => {
    if (index != null) {
      setVehiculo(index.idVehiculo);
      setUbicacion(index.ubicacion);
      setDescripcion(index.descripcion);
    }
  }, [index]);

  const empty = () => {
    setVehiculo("");
    setUbicacion("");
    setDescripcion("");
    setFechaDate("");
  };

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/envios/${index.id}`,
          {
            idVehiculo: vehiculo,
            ubicacion,
            descripcion,
            fechaDate,
            idLocalidad: localidad,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          updateTable(result);
          empty();
        }),
      {
        loading: "Actualizando...",
        success: "Operacion Exitosa",
        error: (err) => err.response.data.message,
      }
    );
    close();
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Dialog
      open={show}
      onClose={() => {
        empty();
        close();
      }}
    >
      <DialogTitle>Actualizar Envio</DialogTitle>
      <DialogContent className="flex flex-col">
        <BoxVehiculos
          setVehiculo={setVehiculo}
          vehiculo={vehiculo}
          sx={{ marginTop: 2 }}
        />
        <TextField
          value={ubicacion}
          onChange={(event) => setUbicacion(event.target.value)}
          label="Ubicacion"
          sx={{ marginTop: 2 }}
        />
        <BoxLocalidad localidad={localidad} setLocalidad={setLocalidad} />
        <TextField
          value={descripcion}
          onChange={(event) => setDescripcion(event.target.value)}
          label="Descripcion"
          sx={{ marginTop: 2 }}
        />
        <TextField
          value={fechaDate}
          onChange={(event) => setFechaDate(event.target.value)}
          type="datetime-local"
          sx={{ marginTop: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            empty();
            close();
          }}
          variant="text"
        >
          Cancelar
        </Button>
        <Button onClick={handleUpdate} variant="outlined">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
