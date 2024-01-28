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

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data);
};

export default function DialogUpdateCliente({
  show = false,
  close = () => {},
  index,
  refreshTable = () => {},
}) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, isLoading, error, mutate } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/localidad`,
    fetcher
  );

  const [mail, setMail] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [cuit, setCuit] = useState("");
  const [cliente, setCliente] = useState("");

  useEffect(() => {
    if (index != null) {
      setMail(index.mail);
      setLocalidad(index?.localidad ?? "");
      setDomicilio(index.domicilio);
      setCuit(index.cuit);
      setCliente(index.cliente);
    }
  }, [index]);

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/cliente/${index.id}`,
          { cliente, domicilio, localidad, mail, cuit },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          refreshTable();
        }),
      {
        loading: "Actualizando...",
        success: "Operacion Exitosa",
        error: (err) => err.response.data.menssage,
      }
    );
    close();
  };

  const empty = () => {
    setCliente("");
    setCuit("");
    setDomicilio("");
    //setLocalidad("");
    setMail("");
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
      <DialogTitle>Actualizar Cliente</DialogTitle>
      <DialogContent className="flex flex-col">
        <TextField
          sx={{ marginTop: 1 }}
          label="Cliente"
          value={cliente}
          onChange={(evt) => setCliente(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 3 }}
          label="Gmail"
          type="email"
          value={mail}
          onChange={(evt) => setMail(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 3 }}
          label="Domicilio"
          value={domicilio}
          onChange={(evt) => setDomicilio(evt.target.value)}
        />
        <Box>
          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel>Localidad</InputLabel>
            <Select
              value={localidad}
              label="Localidad"
              onChange={(evt) => setLocalidad(evt.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {data.map((elem) => {
                return (
                  <MenuItem key={elem.id} value={elem.id}>
                    {elem.ciudad}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <TextField
          sx={{ marginTop: 3 }}
          label="CUIT"
          value={cuit}
          type="number"
          onChange={(evt) => setCuit(evt.target.value)}
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
