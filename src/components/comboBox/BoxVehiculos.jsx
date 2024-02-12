import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import useSWR from "swr";

export default function BoxVehiculos({
  vehiculo,
  setVehiculo,
  size = "medium",
  sx = {},
  errorValue = false
}) {
  const { data, isLoading, error } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/vehiculos`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="min-w-[150px]">
      <FormControl fullWidth sx={sx}>
        <InputLabel>Vehiculos</InputLabel>
        <Select
          size={size}
          value={vehiculo}
          label="Vehiculos"
          error={errorValue}
          onChange={(evt) => setVehiculo(evt.target.value)}
        >
          {data.map((elem) => {
            return (
              <MenuItem key={elem.id} value={elem.id}>
                {elem.marca} - {elem.patente}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
