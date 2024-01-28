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

export default function DialogUpdateHistorialErroresMatrices({
  show = false,
  close = () => {},
  index,
  refreshTable = () => {},
}) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [descripcionFalla, setDescripcionFalla] = useState("");

  useEffect(() => {
    if (index != null) {
      setDescripcionFalla(index?.descripcion_deterioro ?? "");
    }
  }, [index]);

  const handleUpdate = () => {
    /*toast.promise(
      axios
        .put(
          `${BASE_URL}/cliente/${index.id}`,
          { cliente },
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
    close();*/
  };

  const empty = () => {
    setDescripcionFalla("");
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
      <DialogContent className="flex flex-col">
        <TextField
          sx={{ margin: 1 }}
          label="Descripcion Error/Mantenimiento"
          value={descripcionFalla}
          onChange={(evt) => setDescripcionFalla(evt.target.value)}
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
