import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function AutoCompleteInventario({ producto, setProducto, required = false, errorValue = false, sx = { marginY: 2} }) {
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const { data, isLoading, error } = useSWR(
    [`${BASE_URL}/inventario/nombres`, userSupabase.token],
    fetcherToken
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Autocomplete
      options={data}
      getOptionLabel={(elem) => elem.nombre}
      value={producto}
      onChange={(evt, newValue) => setProducto(newValue)}
      sx={sx}
      required={required}
      renderInput={(params) => (
        <TextField {...params} label="Cod Producto" variant="outlined" error={errorValue} />
      )}
    />
  );
}
