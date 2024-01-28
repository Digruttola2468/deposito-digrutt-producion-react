import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import useSWR from "swr";

export default function BoxLocalidad({
  localidad,
  setLocalidad,
  size = "medium",
}) {
  const { data, isLoading, error } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/localidad`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="min-w-[150px] mt-2">
      <FormControl fullWidth sx={{marginTop: 1}}>
        <InputLabel>Localidad</InputLabel>
        <Select
          size={size}
          value={localidad}
          label="Cliente"
          onChange={(evt) => setLocalidad(evt.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((elem) => {
            return (
              <MenuItem key={elem.id} value={elem.id}>
                {elem.ciudad}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
