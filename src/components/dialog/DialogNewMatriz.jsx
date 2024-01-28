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
import AutoCompleteClient from "../autoComplete/AutoCompleteClient";
import BoxMaterial from "../comboBox/BoxMaterial";

export default function DialogNewMatriz({
  show = false,
  close = () => {},
  refreshTable = () => {},
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const [codMatriz, setCodMatriz] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [material, setMaterial] = useState("");
  const [cliente, setCliente] = useState(null);
  const [cantPiezaGolpe, setCantPiezaGolpe] = useState("");

  const empty = () => {
    setCodMatriz("");
    setDescripcion("");
    setMaterial("");
    setCantPiezaGolpe("");
    setCliente(null);
  };

  const handleNewMatriz = () => {
    toast.promise(
      axios
        .post(
          `${BASE_URL}/matrices`,
          {
            cod_matriz: codMatriz,
            descripcion,
            idmaterial: material != "" ? material : null,
            idcliente: cliente,
            cantPiezaGolpe,
          },
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
        loading: "Creando Matriz...",
        success: "Operacion exitosa",
        error: (err) => {
          console.log();
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
      <DialogTitle>Nuevo Matriz</DialogTitle>
      <DialogContent className="flex flex-col">
        <TextField
          value={codMatriz}
          onChange={(event) => setCodMatriz(event.target.value)}
          label="Cod Matriz"
          autoFocus
          required
          sx={{ marginTop: 2 }}
        />
        <TextField
          value={descripcion}
          onChange={(event) => setDescripcion(event.target.value)}
          label="Descripcion"
          required
          sx={{ marginTop: 2 }}
        />
        <TextField
          value={cantPiezaGolpe}
          onChange={(event) => setCantPiezaGolpe(event.target.value)}
          label="Cant Pieza x Golpe"
          required
          sx={{ marginTop: 2 }}
        />
        <BoxMaterial materiaPrima={material} setMateriaPrima={setMaterial} />
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
        <Button onClick={handleNewMatriz} variant="outlined">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
