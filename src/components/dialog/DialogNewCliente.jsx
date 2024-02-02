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

export default function DialogNewCliente({
  show = false,
  close = () => {},
  refreshTable = () => {},
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const [cliente, setCliente] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [mail, setMail] = useState("");
  const [cuit, setCuit] = useState("");

  const handleNewCliente = () => {
    toast.promise(
      axios
        .post(
          `${BASE_URL}/cliente`,
          { cliente, domicilio, idLocalidad: localidad.id, mail, cuit },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          refreshTable();
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

  const empty = () => {
    setMail("");
    setCuit("");
    setLocalidad("");
    setDomicilio("");
    setCliente("");
  };

  return (
    <Dialog
      open={show}
      onClose={() => {
        empty();
        close();
      }}
    >
      <DialogTitle>Nuevo Cliente</DialogTitle>
      <DialogContent className="flex flex-col">
        <TextField
          value={cliente}
          onChange={(event) => setCliente(event.target.value)}
          label="Cliente"
          autoFocus
          required
          sx={{ marginTop: 2 }}
        />
        <TextField
          value={mail}
          onChange={(event) => setMail(event.target.value)}
          type="email"
          label="Correo Electronico"
          sx={{ marginTop: 2 }}
        />
        <TextField
          value={cuit}
          onChange={(event) => setCuit(event.target.value)}
          label="CUIT"
          type="number"
          sx={{ marginTop: 2 }}
        />
        <BoxLocalidad localidad={localidad} setLocalidad={setLocalidad} />
        <TextField
          value={domicilio}
          onChange={(event) => setDomicilio(event.target.value)}
          label="Domicilio"
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
        <Button onClick={handleNewCliente} variant="outlined">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}