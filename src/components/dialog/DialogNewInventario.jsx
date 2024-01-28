import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AutoCompleteClient from "../autoComplete/AutoCompleteClient";
import toast from "react-hot-toast";

export default function DialogNewInventario({
  show = false,
  close = () => {},
  refreshTable = () => {},
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pesoUnidad, setPesoUnidad] = useState("");
  const [cliente, setCliente] = useState(null);

  const handleCreateNewProduct = () => {
    toast.promise(
      axios
        .post(
          `${BASE_URL}/inventario`,
          { nombre, descripcion, pesoUnidad: pesoUnidad != '' ? pesoUnidad : null, idCliente: cliente?.id ?? null },
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
        loading: "Creando Producto...",
        success: "Operacion exitosa",
        error: (err) => {
          console.log(err);
          return err.response.data?.message ?? 'Ocurrio un error';
        },
      }
    );
  };

  const empty = () => {
    setNombre("");
    setDescripcion("");
    setPesoUnidad("");
    setCliente(null);
  };

  return (
    <Dialog
      open={show}
      onClose={() => {
        empty();
        close();
      }}
    >
      <DialogTitle>Nuevo Producto</DialogTitle>
      <DialogContent className="flex flex-col">
        <TextField
          sx={{ marginTop: 2 }}
          label="Cod. Producto"
          value={nombre}
          onChange={(evt) => setNombre(evt.target.value)}
          required
        />
        <TextField
          sx={{ marginTop: 2 }}
          label="Descripcion"
          multiline
          rows={2}
          value={descripcion}
          onChange={(evt) => setDescripcion(evt.target.value)}
          required
        />
        <TextField
          value={pesoUnidad}
          onChange={(event) => setPesoUnidad(event.target.value)}
          label="Peso x Unidad"
          type="number"
          autoFocus
          sx={{ marginTop: 2 }}
        />
        <AutoCompleteClient cliente={cliente} setCliente={setCliente} />
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
        <Button onClick={handleCreateNewProduct} variant="outlined">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
