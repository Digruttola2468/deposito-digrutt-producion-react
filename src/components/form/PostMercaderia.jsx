import {
  Autocomplete,
  Button,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import { MercaderiaContext } from "../../context/MercaderiaContext";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function PostMercaderia() {
  const { postTable } = useContext(MercaderiaContext);
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, isLoading, error } = useSWR(
    [`${BASE_URL}/inventario/nombres`, userSupabase.token],
    fetcherToken
  );

  const [codProducto, setcodProducto] = useState(null);
  const [stock, setStock] = useState("");
  const [fecha, setFecha] = useState("");
  const [observacion, setObservacion] = useState("");

  const [isEntrada, setIsEntrada] = useState(true);

  const [requestError, setRequestError] = useState({ campus: null });

  const emptyRequestError = (campus) => {
    if (requestError.campus == campus) setRequestError({ campus: null });
  };

  const handleSubmitPost = (evt) => {
    evt.preventDefault();

    if (codProducto != null) {
      if (isEntrada) {
        toast.promise(
          axios
            .post(
              `${BASE_URL}/mercaderia`,
              {
                fecha: fecha,
                stock: stock,
                idinventario: codProducto.id,
                idcategoria: 2,
              },
              {
                headers: {
                  Authorization: `Bearer ${userSupabase.token}`,
                },
              }
            )
            .then((result) => {
              postTable(result.data);
              empty();
            }),
          {
            loading: "Enviando...",
            success: "Operacion Exitosa",
            error: (err) => {
              setRequestError({ campus: err.response.data.campus });
              return err.response.data.message;
            },
          }
        );
      } else {
        toast.promise(
          axios
            .post(
              `${BASE_URL}/mercaderia/salida`,
              {
                fecha: fecha,
                stock: stock,
                idinventario: codProducto.id,
                observacion: observacion,
              },
              {
                headers: {
                  Authorization: `Bearer ${userSupabase.token}`,
                },
              }
            )
            .then((result) => {
              empty();
            }),
          {
            loading: "Enviando...",
            success: "Operacion Exitosa",
            error: (err) => {
              setRequestError({ campus: err.response.data.campus });
              return err.response.data.message;
            },
          }
        );
      }
    } else {
      setRequestError({ campus: "codProducto" });
      toast.error("Campo Cod.Producto vacio");
    }
  };

  const empty = () => {
    setStock("");
    setcodProducto(null);
    setObservacion("");
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <form
      className="flex flex-col rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 border lg:mx-5 mx-1 mt-2"
      onSubmit={handleSubmitPost}
    >
      <h2 className="uppercase w-full text-center font-bold text-lg">
        Agregar Nueva Mercaderia
      </h2>
      <div className="w-full flex flex-col items-center justify-between my-2">
        <Stack direction="row" alignItems="center">
          <Typography>Entrada</Typography>
          <Switch
            defaultValue={false}
            value={isEntrada}
            onChange={(evt, value) => setIsEntrada(!value)}
          />
          <Typography>Salida</Typography>
        </Stack>
        <p className="text-gray-400">
          {codProducto != null ? codProducto.descripcion : ""}
        </p>
      </div>
      <div className="flex flex-row wrap">
        <Autocomplete
          disablePortal
          options={data}
          getOptionLabel={(elem) => elem.nombre}
          sx={{ width: 200, marginTop: 1 }}
          value={codProducto}
          onChange={(evt, newValue) => {
            emptyRequestError("codProducto");
            setcodProducto(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cod Producto"
              error={requestError.campus == "codProducto"}
            />
          )}
        />
        <TextField
          label="Cantidad"
          value={stock}
          type="number"
          onChange={(evt) => {
            emptyRequestError("stock");
            setStock(evt.target.value);
          }}
          variant="outlined"
          error={requestError.campus == "stock" ? true : false}
          sx={{ width: 100, marginLeft: 1, marginTop: 1 }}
        />
      </div>
      <div>
        <TextField
          value={fecha}
          type="date"
          onChange={(evt) => {
            emptyRequestError("fecha");
            setFecha(evt.target.value);
          }}
          variant="outlined"
          sx={{ width: "100%", marginTop: 1 }}
          error={requestError.campus == "fecha" ? true : false}
        />
      </div>
      {isEntrada == false && (
        <div>
          <TextField
            label="Descripcion Salida"
            value={observacion}
            onChange={(evt) => {emptyRequestError("observacion");setObservacion(evt.target.value)}}
            variant="outlined"
            sx={{ width: "100%", marginTop: 1 }}
            error={requestError.campus == "observacion"}
          />
        </div>
      )}
      <div className="flex flex-row justify-end mt-4">
        <Button onClick={empty}>Limpiar</Button>
        <Button type="submit" variant="contained">
          Agregar
        </Button>
      </div>
    </form>
  );
}
