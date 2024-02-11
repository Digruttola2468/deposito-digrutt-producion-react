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
import { MatricesContext } from "../../context/MatricesContext";

export default function DialogNewMatriz({
  show = false,
  close = () => {},
  refreshTable = () => {},
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { postTable } = useContext(MatricesContext);

  const [numMatriz, setNumMatriz] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [material, setMaterial] = useState("");
  const [cliente, setCliente] = useState(null);
  const [cantPiezaGolpe, setCantPiezaGolpe] = useState("");

  const [requestError, setRequestError] = useState({ campus: null });

  const emptyRequestError = (campus) => {
    if (requestError.campus == campus) setRequestError({ campus: null });
  };

  const empty = () => {
    setNumMatriz("");
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
            numero_matriz: numMatriz,
            descripcion,
            idmaterial: material != "" ? material : null,
            idcliente: cliente?.id ?? null,
            cantPiezaGolpe,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          postTable(result.data.data);
          empty();
          close();
        }),
      {
        loading: "Creando Matriz...",
        success: "Operacion exitosa",
        error: (err) => {
          setRequestError({ campus: err.response.data.campus });
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
          value={numMatriz}
          onChange={(event) => {
            emptyRequestError("numeroMatriz");
            setNumMatriz(event.target.value);
          }}
          label="Numero Matriz"
          autoFocus
          required
          type="number"
          sx={{ marginTop: 2 }}
          error={requestError.campus == "numeroMatriz" ? true : false}
        />
        <TextField
          value={descripcion}
          onChange={(event) => {
            emptyRequestError("descripcion");
            setDescripcion(event.target.value);
          }}
          label="Descripcion"
          required
          sx={{ marginTop: 2 }}
          error={requestError.campus == "descripcion" ? true : false}
        />
        <TextField
          value={cantPiezaGolpe}
          onChange={(event) => {
            emptyRequestError("cantPiezaxGolpe");
            setCantPiezaGolpe(event.target.value);
          }}
          label="Cant Pieza x Golpe"
          required
          type="number"
          sx={{ marginTop: 2 }}
          error={requestError.campus == "cantPiezaxGolpe" ? true : false}
        />
        <BoxMaterial materiaPrima={material} setMateriaPrima={setMaterial} />
        <AutoCompleteClient
          cliente={cliente}
          setCliente={setCliente}
          errorClient={requestError.campus == "idcliente" ? true : false}
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
        <Button onClick={handleNewMatriz} variant="outlined">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
