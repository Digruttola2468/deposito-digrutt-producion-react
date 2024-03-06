import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import useSWR from "swr";

export default function BoxTurnoProducion({
  turnoProducion,
  setTurnoProducion,
  size = "medium",
}) {
  const { data, isLoading, error } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/turnosProducion`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="min-w-[150px]">
      <FormControl fullWidth sx={{ marginTop: 1 }}>
        <InputLabel>Turno</InputLabel>
        <Select
          size={size}
          value={turnoProducion}
          label="Turno"
          onChange={(evt) => setTurnoProducion(evt.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((elem) => {
            return (
              <MenuItem key={elem.id} value={elem}>
                {elem.turno} - {elem.horaInicio} a {elem.horaFinal}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
