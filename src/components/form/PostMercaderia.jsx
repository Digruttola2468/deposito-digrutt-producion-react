import { Autocomplete, Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function PostMercaderia({refreshTable}) {
  const { userSupabase, BASE_URL } = useContext(UserContext);

  const { data, isLoading, error } = useSWR(
    [`${BASE_URL}/inventario/nombres`, userSupabase.token],
    fetcherToken
  );

  const [codProducto, setcodProducto] = useState(null);
  const [stock, setStock] = useState("");
  const [fecha, setFecha] = useState("");

  const handleSubmitPost = (evt) => {
    evt.preventDefault();

    if (codProducto != null) {
      toast.promise(
        axios.post(
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
        ).then(result => {
          refreshTable();
        }), {
          loading: 'Enviando...',
          success: 'Operacion Exitosa',
          error: (err) => err.response.data.message
        }
      )
    }
  };

  const empty = () => {
    setFecha("");
    setStock("");
    setcodProducto(null);
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
      <div className="w-full flex flex-row items-center justify-between my-2">
        
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
          onChange={(evt, newValue) => setcodProducto(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Cod Producto" />
          )}
        />
        <TextField
          label="Cantidad"
          value={stock}
          type="number"
          onChange={(evt) => setStock(evt.target.value)}
          variant="outlined"
          sx={{ width: 100, marginLeft: 1, marginTop: 1 }}
        />
      </div>
      <div>
        <TextField
          value={fecha}
          type="date"
          onChange={(evt) => setFecha(evt.target.value)}
          variant="outlined"
          sx={{ width: "100%", marginTop: 1 }}
        />
      </div>
      <div className="flex flex-row justify-end mt-4">
        <Button onClick={empty}>Limpiar</Button>
        <Button type="submit" variant="contained">
          Agregar
        </Button>
      </div>
    </form>
  );
}
