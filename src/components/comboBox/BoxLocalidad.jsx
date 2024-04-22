import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

export default function BoxLocalidad({
  localidad,
  setLocalidad,
  size = "medium",
  sx = {marginTop: 1},
  errorValue = false
}) {
  const { BASE_URL } = useContext(UserContext);
  const { data, isLoading, error } = useSWR(
    `${BASE_URL}/localidad`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="min-w-[150px] mt-2">
      <FormControl fullWidth sx={sx}>
        <InputLabel>Localidad</InputLabel>
        <Select
          size={size}
          value={localidad}
          label="Localidad"
          error={errorValue}
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
