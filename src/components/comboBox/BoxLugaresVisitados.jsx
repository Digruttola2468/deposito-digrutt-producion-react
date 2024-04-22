import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

export default function BoxLugaresVisitados({
  lugarVisitado,
  setLugarVisitado,
  size = "medium",
  sx = { marginTop: 1 },
}) {
  const { BASE_URL } = useContext(UserContext);
  const { data, isLoading, error } = useSWR(
    `${BASE_URL}/savedPlacesEnviados`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="min-w-[150px] mt-2">
      <FormControl fullWidth sx={sx}>
        <InputLabel>Lugares Comunes</InputLabel>
        <Select
          defaultValue={""}
          size={size}
          value={lugarVisitado.nombreUbicacion}
          label="Lugares Comunes"
          onChange={setLugarVisitado}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((elem) => {
            return (
              <MenuItem key={elem.id} value={elem}>
                {elem.nombreUbicacion}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
