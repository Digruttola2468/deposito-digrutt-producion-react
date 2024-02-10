import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import BoxCategoria from "../comboBox/BoxCategoria";
import { HistorialMatrizContext } from "../../context/HistorialMatrizContext";

export default function DialogUpdateHistorialErroresMatrices({
  show = false,
  close = () => {},
  index,
  refreshTable = () => {},
}) {
  const { userSupabase, BASE_URL } = useContext(UserContext);
  const { updateTable } = useContext(HistorialMatrizContext);

  const [descripcionFalla, setDescripcionFalla] = useState("");
  const [fecha, setFecha] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    if (index != null) {
      setDescripcionFalla(index?.descripcion_deterioro ?? "");
    }
  }, [index]);

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/historialMatriz/${index.id}`,
          {
            descripcion_deterioro: descripcionFalla,
            fecha: fecha,
            idCategoria: categoria,
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
        error: (err) => err.response.data.menssage,
      }
    );
  };

  const empty = () => {
    setDescripcionFalla("");
    setFecha("");
    setCategoria("");
  };

  return (
    <Dialog
      open={show}
      onClose={() => {
        empty();
        close();
      }}
    >
      <DialogTitle>Actualizar Historial</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <TextField
          type="date"
          value={fecha}
          onChange={(evt) => setFecha(evt.target.value)}
        />
        <TextField
          label="Descripcion Error/Mantenimiento"
          value={descripcionFalla}
          multiline
          rows={3}
          onChange={(evt) => setDescripcionFalla(evt.target.value)}
        />
        <BoxCategoria
          categoria={categoria}
          setCategoria={setCategoria}
          range={[
            { id: 3, categoria: "Mantenimiento" },
            { id: 4, categoria: "Falla" },
          ]}
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
