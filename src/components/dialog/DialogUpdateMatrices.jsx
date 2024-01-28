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
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data);
};

export default function DialogUpdateMatrices({
  show = false,
  close = () => {},
  index,
  refreshTable = () => {},
}) {
  const { data, isLoading, error, mutate } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/materiaPrima`,
    fetcher
  );

  const swrCliente = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/clientes`,
    fetcher
  );

  const [descripcion, setDescripcion] = useState("");
  const [material, setMaterial] = useState("");
  const [cliente, setCliente] = useState("");
  const [cantPiezaGolpe, setCantPiezaGolpe] = useState("");

  useEffect(() => {
    /*if (index != null) {
        setFecha(index.fecha);
        setHrs(index.hrs);
        setNumMaquina(index.numberSerie);
      }*/
  }, [index]);

  const handleUpdate = () => {};

  const empty = () => {
    setDescripcion("");
    setMaterial("");
    setCliente("");
    setCantPiezaGolpe("");
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  if (swrCliente.isLoading) return <></>;
  if (swrCliente.error) return <></>;

  return (
    <Dialog
      open={show}
      onClose={() => {
        empty();
        close();
      }}
    >
      <DialogTitle>Actualizar Matrices</DialogTitle>
      <DialogContent className="flex flex-col">
        <TextField
          sx={{ marginTop: 2 }}
          label="Descripcion"
          multiline
          rows={2}
          value={descripcion}
          onChange={(evt) => setDescripcion(evt.target.value)}
        />
        <Box>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Materia Prima</InputLabel>
            <Select
              value={material}
              label="Materia Prima"
              onChange={(evt) => setMaterial(evt.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {data.map((elem) => {
                return (
                  <MenuItem key={elem.id} value={elem.id}>
                    {elem.material}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <TextField
          sx={{ marginTop: 2 }}
          label="Cantidad Pieza x Golpe"
          value={cantPiezaGolpe}
          type="number"
          onChange={(evt) => setCantPiezaGolpe(evt.target.value)}
        />
        <Box>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Cliente</InputLabel>
            <Select
              value={cliente}
              label="Cliente"
              onChange={(evt) => setCliente(evt.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {swrCliente.data.map((elem) => {
                return (
                  <MenuItem key={elem.id} value={elem.id}>
                    {elem.cliente}
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
