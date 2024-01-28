import { Autocomplete, TextField } from "@mui/material";
import useSWR from "swr";

export default function AutoCompleteClient({cliente, setCliente, sx = { marginTop: 2 }}) {
  const { data, isLoading, error } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/clientes`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );
  
  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Autocomplete
      options={data}
      getOptionLabel={(elem) => elem.cliente}
      value={cliente}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(evt, newValue) => setCliente(newValue)}
      sx={sx}
      renderInput={(params) => (
        <TextField {...params} label="Cliente" variant="outlined" />
      )}
    />
  );
}
