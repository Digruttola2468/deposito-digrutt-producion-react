import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import useSWR from "swr";

export default function BoxColor({ color, setColor, size = "small" }) {
  const { data, isLoading, error } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/colores`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="min-w-[150px] ml-1">
      <FormControl fullWidth>
        <InputLabel>Color</InputLabel>
        <Select
          size={size}
          value={color}
          label="Cliente"
          onChange={(evt) => setColor(evt.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((elem) => {
            return (
              <MenuItem key={elem.id} value={elem.id}>
                {elem.color}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
