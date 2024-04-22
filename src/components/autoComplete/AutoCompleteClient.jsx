import { Autocomplete, TextField } from "@mui/material";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

export default function AutoCompleteClient({cliente, setCliente, sx = { marginTop: 2 }, errorClient = false}) {
  const { BASE_URL } = useContext(UserContext);
  const { data, isLoading, error } = useSWR(
    `${BASE_URL}/clientes`,
    (url) => {
      return axios.get(url).then((result) => result.data.data);
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
        <TextField {...params} label="Cliente" variant="outlined" error={errorClient}/>
      )}
    />
  );
}
