import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import useSWR from "swr";

export default function AutoCompleteColor({color, setColor}) {
  const { data, isLoading, error } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/colores`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Autocomplete
      options={data}
      getOptionLabel={(elem) => elem.color}
      value={color}
      onChange={(evt, newValue) => setColor(newValue)}
      sx={{ marginTop: 3, marginLeft: 1 }}
      renderInput={(params) => (
        <TextField {...params} label="Color" variant="outlined" />
      )}
    />
  );
}
