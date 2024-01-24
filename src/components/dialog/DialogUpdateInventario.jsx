import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

export default function DialogUpdateInventario({
  show = false,
  close = () => {},
  index,
  refreshTable = () => {},
}) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, error, isLoading } = useSWR(`${BASE_URL}/clientes`, fetcher);

  const [articulo, setArticulo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pesoUnidad, setPesoUnidad] = useState("");
  const [cliente, setCodCliente] = useState(null);

  useEffect(() => {
    if (index != null) {
      setArticulo(index.articulo);
      setNombre(index.nombre);
      setDescripcion(index.descripcion);
      setPesoUnidad(index.pesoUnidad);
    }
    
  }, [index])

  /**{
    "id": 12,
    "nombre": "oreja028",
    "precio": 0,
    "descripcion": "oreja (A) grande marron x 400 unid ",
    "idcolor": 21,
    "idtipoproducto": 17,
    "entrada": 1200,
    "salida": 0,
    "pesoUnidad": 0,
    "stockCaja": 400,
    "idCliente": 1,
    "idCodMatriz": null,
    "articulo": "AXE009OGM",
    "url_image": null,
    "cliente": "axel",
    "idcliente": 1
} */

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/inventario/${index.id}`,
          {
            articulo,
            nombre,
            descripcion,
            pesoUnidad: parseFloat(pesoUnidad),
            idCliente: cliente != null ? cliente.id : null,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          console.log("result Update: ", result);
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

  if (error) return <></>;
  if (isLoading) return <></>;

  return (
    <Dialog open={show} onClose={close}>
      <DialogTitle>Actualizar Inventario</DialogTitle>
      <DialogContent className="flex flex-col">
        <TextField
          sx={{ marginTop: 1, marginLeft: 1 }}
          label="Articulo"
          value={articulo}
          onChange={(evt) => setArticulo(evt.target.value.toUpperCase())}
        />
        <TextField
          sx={{ marginTop: 3, marginLeft: 1 }}
          label="Cod. Producto"
          value={nombre}
          onChange={(evt) => setNombre(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 3, marginLeft: 1 }}
          label="Descripcion"
          multiline
          rows={2}
          value={descripcion}
          onChange={(evt) => setDescripcion(evt.target.value)}
        />
        <TextField
          value={pesoUnidad}
          onChange={(event) => setPesoUnidad(event.target.value)}
          label="Peso x Unidad"
          type="number"
          autoFocus
          sx={{ marginTop: 3, marginLeft: 1 }}
        />
        <Autocomplete
          options={data}
          getOptionLabel={(elem) => elem.cliente}
          value={cliente}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(evt, newValue) => setCodCliente(newValue)}
          sx={{ marginTop: 3, marginLeft: 1 }}
          renderInput={(params) => (
            <TextField {...params} label="Clientes" variant="outlined" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} variant="text">
          Cancelar
        </Button>
        <Button onClick={handleUpdate} variant="outlined">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
