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

  const [requestError, setRequestError] = useState({ campus: null });

  const emptyRequestError = (campus) => {
    if (requestError.campus == campus) setRequestError({ campus: null });
  };

  const empty = () => {
    setVehiculo("");
    setUbicacion("");
    setDescripcion("");
    setFechaDate("");
    setLugarVisitado("");
    setRequestError({ campus: null });
  };

  const handleNewEnvio = () => {
    let lat = null;
    let lon = null;

    if (objLugarVisitado != "" && objLugarVisitado != null) {
      lat = objLugarVisitado.lat;
      lon = objLugarVisitado.lon;
    }

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
            lat,
            lon
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
          console.log(err.response.data.campus);
          setRequestError({ campus: err.response.data.campus });
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
          setVehiculo={(value) => {
            emptyRequestError("idVehiculo");
            setVehiculo(value);
          }}
          vehiculo={vehiculo}
          sx={{ marginTop: 2 }}
          errorValue={requestError.campus == "idVehiculo" ? true : false}
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
          onChange={(event) => {
            emptyRequestError("ubicacion");
            setUbicacion(event.target.value);
          }}
          label="Ubicacion"
          sx={{ marginTop: 2 }}
          error={requestError.campus == "ubicacion" ? true : false}
        />
        <BoxLocalidad
          localidad={localidad}
          setLocalidad={(value) => {
            emptyRequestError("idLocalidad");
            setLocalidad(value);
          }}
          sx={{ marginTop: 2 }}
          errorValue={requestError.campus == "idLocalidad" ? true : false}
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
