import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

export default function AutoCompleteTypesProducts({tiposProducts, setTiposProducts}) {
  const { BASE_URL } = useContext(UserContext);
  const { data, isLoading, error } = useSWR(
    `${BASE_URL}/tiposproductos`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Autocomplete
      options={data}
      getOptionLabel={(elem) => elem.tipo}
      value={tiposProducts}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(evt, newValue) => setTiposProducts(newValue)}
      sx={{ marginTop: 3, marginLeft: 1 }}
      renderInput={(params) => (
        <TextField {...params} label="Tipo del Producto" variant="outlined" />
      )}
    />
  );
}
