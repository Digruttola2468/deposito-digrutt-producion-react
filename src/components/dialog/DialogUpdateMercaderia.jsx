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
import { MercaderiaContext } from "../../context/MercaderiaContext";

export default function DialogUpdateMercaderia({
  show = false,
  close = () => {},
  index,
}) {
  const { updateTable } = useContext(MercaderiaContext);
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const [fecha, setFecha] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (index != null) {
      setStock(index.stock);
    }
  }, [index]);

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/mercaderia/${index.id}`,
          { fecha, stock },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          updateTable(index.id, result.data)
          empty();
          close();
        }),
      {
        loading: "Actualizando Mercaderia...",
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
    setStock("");
  };

  return (
    <Dialog
      open={show}
      onClose={() => {
        empty();
        close();
      }}
    >
      <DialogTitle>Actualizar Mercaderia</DialogTitle>
      <DialogContent className="flex flex-col">
        <TextField
          sx={{ marginTop: 2 }}
          value={fecha}
          type="date"
          onChange={(evt) => setFecha(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 2 }}
          label="Cantidad"
          value={stock}
          type="number"
          onChange={(evt) => setStock(evt.target.value)}
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
