import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

export default function BoxVehiculos({
  vehiculo,
  setVehiculo,
  size = "medium",
  sx = {},
  errorValue = false
}) {
  const { BASE_URL } = useContext(UserContext);
  const { data, isLoading, error } = useSWR(
    `${BASE_URL}/vehiculos`,
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
                {elem.modelo} - {elem.patente}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
