import {
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
import { MaquinaParadaContext } from "../../context/MaquinaParadaContext";

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data);
};

export default function DialogUpdateMaquinaParada({
  show = false,
  close = () => {},
  index,
  refreshTable = () => {},
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { updateTable } = useContext(MaquinaParadaContext);
  const { data, isLoading, error, mutate } = useSWR(
    `${BASE_URL}/motivoMaquinaParada`,
    fetcher
  );

  const [hrs, setHrs] = useState("");
  const [fecha, setFecha] = useState("");
  const [motivoMaquinaParada, setMotivoMaquinaParada] = useState("");
  const [numMaquina, setNumMaquina] = useState("");

  useEffect(() => {
    if (index != null) {
      setFecha(index.fecha);
      setHrs(index.hrs);
      setNumMaquina(index.numberSerie);
    }
  }, [index]);

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/maquinaParada/${index.id}`,
          {
            hrs,
            fecha,
            idMotivoMaquinaParada: motivoMaquinaParada,
            idMaquina: numMaquina,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          updateTable(index.id, result.data.data)
          //refreshTable();
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
    setHrs("");
    setFecha("");
    setMotivoMaquinaParada("");
    setNumMaquina("");
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
      <DialogTitle>Actualizar Maquina Parada</DialogTitle>
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
          label="Hrs Maquina Parada"
          value={hrs}
          type="number"
          onChange={(evt) => setHrs(evt.target.value)}
        />
        <Box>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Motivo Maquina Parada</InputLabel>
            <Select
              value={motivoMaquinaParada}
              label="Motivo Maquina Parada"
              onChange={(evt) => setMotivoMaquinaParada(evt.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {data.map((elem) => {
                return (
                  <MenuItem key={elem.id} value={elem.id}>
                    {elem.descripcion}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
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
