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
import { MatricesContext } from "../../context/MatricesContext";

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data);
};

export default function DialogUpdateMatrices({
  show = false,
  close = () => {},
  index,
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { updateTable } = useContext(MatricesContext);

  const { data, isLoading, error, mutate } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/materiaPrima`,
    fetcher
  );

  const [descripcion, setDescripcion] = useState("");
  const [material, setMaterial] = useState("");
  const [cantPiezaGolpe, setCantPiezaGolpe] = useState("");

  useEffect(() => {
    if (index != null) {
      setDescripcion(index.descripcion);
      setCantPiezaGolpe(index.cantPiezaGolpe);
    }
  }, [index]);

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/matrices/${index.id}`,
          {
            descripcion,
            idmaterial: material != "" ? material : null,
            cantPiezaGolpe,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          updateTable(index.id, result.data.data)
          close();
        }),
      {
        loading: "Actualizando Matriz...",
        success: "Operacion Exitosa",
        error: (err) => {
          console.log(err);
          return "Ocurrio un error";
        },
      }
    );
  };

  const empty = () => {
    setDescripcion("");
    setMaterial("");
    setCantPiezaGolpe("");
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
              defaultValue=""
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
