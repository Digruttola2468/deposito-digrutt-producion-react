import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { InventarioContext } from "../../context/InventarioContext";

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data);
};

export default function DialogUpdateInventario({
  show = false,
  close = () => {},
}) {
  const { updateTable, index } = useContext(InventarioContext);
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, error, isLoading } = useSWR(`${BASE_URL}/clientes`, fetcher);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [pesoUnidad, setPesoUnidad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [cliente, setCodCliente] = useState(null);

  const [requestError, setRequestError] = useState({ campus: null });

  useEffect(() => {
    if (index != null) {
      setNombre(index.nombre);
      setDescripcion(index.descripcion);
      setPesoUnidad(index?.pesoUnidad ?? "");
      setUbicacion(index?.ubicacion ?? "");
    }
  }, [index]);

  const emptyRequestError = () => {
    setRequestError({ campus: null });
  };

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/inventario/${index.id}`,
          {
            nombre,
            descripcion,
            pesoUnidad: parseFloat(pesoUnidad),
            idCliente: cliente != null ? cliente.id : null,
            ubicacion,
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
        error: (err) => {
          setRequestError({ campus: err.response.data.campus });
          return err.response.data.message;
        },
      }
    );
  };

  if (error) return <></>;
  if (isLoading) return <></>;

  return (
    <Dialog open={show} onClose={close}>
      <DialogTitle>Actualizar Inventario</DialogTitle>
      <DialogContent className="flex flex-col">
        <TextField
          sx={{ marginTop: 3, marginLeft: 1 }}
          label="Cod. Producto"
          value={nombre}
          onChange={(evt) => {
            emptyRequestError();
            setNombre(evt.target.value);
          }}
          error={requestError.campus == "codProducto" ? true : false}
        />
        <TextareaAutosize
          className={`mt-4 ml-2 px-[14px] py-[16px] border border-[#c4c4c4] focus:outline-[2px] focus:outline-[#007fff] rounded-md `}
          placeholder="Descripcion"
          value={descripcion}
          onChange={(evt) => setDescripcion(evt.target.value)}
        />
        <TextField
          value={pesoUnidad}
          onChange={(event) => {
            emptyRequestError();
            setPesoUnidad(event.target.value);
          }}
          label="Peso x Unidad"
          type="number"
          autoFocus
          sx={{ marginTop: 3, marginLeft: 1 }}
        />
        <TextField
          value={ubicacion}
          onChange={(event) => {
            emptyRequestError();
            setUbicacion(event.target.value);
          }}
          label="Ubicacion"
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
