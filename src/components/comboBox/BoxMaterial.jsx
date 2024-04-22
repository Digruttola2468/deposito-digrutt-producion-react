import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

export default function BoxMaterial({
  materiaPrima,
  setMateriaPrima,
  size = "medium",
}) {
  const { BASE_URL } = useContext(UserContext);
  const { data, isLoading, error } = useSWR(
    `${BASE_URL}/materiaPrima`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="min-w-[150px] mt-2">
      <FormControl fullWidth sx={{ marginTop: 1 }}>
        <InputLabel>Materia Prima</InputLabel>
        <Select
          size={size}
          value={materiaPrima}
          label="Materia Prima"
          onChange={(evt) => setMateriaPrima(evt.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((elem) => {
            return (
              <MenuItem key={elem.id} value={elem.id}>
                {elem.material}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
