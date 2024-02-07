import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import BoxLocalidad from "../comboBox/BoxLocalidad";
import { EnviosContext } from "../../context/EnviosContext";
import BoxVehiculos from "../comboBox/BoxVehiculos";
import BoxLugaresVisitados from "../comboBox/BoxLugaresVisitados";

export default function DialogNewEnvio({
  show = false,
  close = () => {},
  refreshTable = () => {},
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { postTable } = useContext(EnviosContext);

  const [vehiculo, setVehiculo] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaDate, setFechaDate] = useState("");

  const [objLugarVisitado, setLugarVisitado] = useState("");

  const empty = () => {
    setVehiculo("");
    setUbicacion("");
    setDescripcion("");
    setFechaDate("");
    setLugarVisitado("")
  };

  const handleNewEnvio = () => {
    toast.promise(
      axios
        .post(
          `${BASE_URL}/envios`,
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
          postTable(result);

          empty();
          close();
        }),
      {
        loading: "Creando Cliente...",
        success: "Operacion exitosa",
        error: (err) => {
          console.log();
          return err.response.data?.message ?? "Something Wrong";
        },
      }
    );
  };

  return (
    <Dialog
      open={show}
      onClose={() => {
        empty();
        close();
      }}
    >
      <DialogTitle>Nuevo Envio</DialogTitle>
      <DialogContent className="flex flex-col">
        <BoxVehiculos
          setVehiculo={setVehiculo}
          vehiculo={vehiculo}
          sx={{ marginTop: 2 }}
        />
        <BoxLugaresVisitados
          setLugarVisitado={(evt) => {
            const lugar = evt.target.value;
            setLugarVisitado(lugar);

            setUbicacion(lugar.ubicacion);
            setLocalidad(lugar.idLocalidad);
          }}
          lugarVisitado={objLugarVisitado}
        />
        <TextField
          value={ubicacion}
          onChange={(event) => setUbicacion(event.target.value)}
          label="Ubicacion"
          sx={{ marginTop: 2 }}
        />
        <BoxLocalidad
          localidad={localidad}
          setLocalidad={setLocalidad}
          sx={{ marginTop: 2 }}
        />
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
        <Button onClick={handleNewEnvio} variant="outlined">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
