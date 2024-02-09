import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";
import { ProducionContext } from "../../context/ProduccionContext";

export default function DialogUpdateProduccion({
  show = false,
  close = () => {},
  index,
}) {
  const { updateTable } = useContext(ProducionContext);
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const [fecha, setFecha] = useState("");
  const [numMaquina, setNumMaquina] = useState("");
  const [golpesReales, setGolpesReales] = useState("");
  const [piezasProducidas, setPiezasProducidas] = useState("");
  const [promGolpesHora, setPromGolpesHora] = useState("");

  useEffect(() => {
    if (index != null) {
      setFecha(index.fecha);
      setNumMaquina(index.num_maquina);
      setGolpesReales(index.golpesReales);
      setPiezasProducidas(index.piezasProducidas);
      setPromGolpesHora(index.prom_golpeshora);
    }
  }, [index]);

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/producion/${index.id}`,
          {
            fecha,
            num_maquina: numMaquina,
            golpesReales,
            piezasProducidas,
            prom_golpeshora: promGolpesHora,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          updateTable(index.id, result.data.data);
          close();
        }),
      {
        loading: "Actualizando...",
        success: "Operacion Exitosa",
        error: (err) => {
          console.log(err);
          return "Ocurrio un Error";
        },
      }
    );
  };

  const empty = () => {
    setFecha("");
    setNumMaquina("");
    setGolpesReales("");
    setPiezasProducidas("");
    setPromGolpesHora("");
  };
  //producion/:idProduccion
  return (
    <Dialog
      open={show}
      onClose={() => {
        empty();
        close();
      }}
    >
      <DialogTitle>Actualizar Produccion</DialogTitle>
      <DialogContent className="flex flex-col">
        <TextField
          sx={{ marginTop: 2 }}
          value={fecha}
          type="date"
          onChange={(evt) => setFecha(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 2 }}
          label="Numero Maquina"
          value={numMaquina}
          type="number"
          onChange={(evt) => setNumMaquina(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 2 }}
          label="Golpes Reales"
          value={golpesReales}
          type="number"
          onChange={(evt) => setGolpesReales(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 2 }}
          label="Piezas Producidas"
          value={piezasProducidas}
          type="number"
          onChange={(evt) => setPiezasProducidas(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 2 }}
          label="Promedio Golpes/h"
          value={promGolpesHora}
          type="number"
          onChange={(evt) => setPromGolpesHora(evt.target.value)}
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
