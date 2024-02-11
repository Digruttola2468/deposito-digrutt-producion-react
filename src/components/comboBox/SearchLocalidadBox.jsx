import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data);
};

export default function SearchLocalidadBox({
  filterTable,
  refresh,
  apiOriginal,
  setLocalidad = () => {}
}) {
  const { data, isLoading, error, mutate } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/localidad`,
    fetcher
  );

  const [localidades, setLocalidades] = useState("");

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="w-[150px] ml-1">
      <FormControl fullWidth>
        <InputLabel>Localidad</InputLabel>
        <Select
          size="small"
          value={localidades}
          label="Localidad"
          onChange={(evt) => {
            const comboBoxLocalidad = evt.target.value;
            setLocalidad(comboBoxLocalidad);
            setLocalidades(comboBoxLocalidad);

            if (comboBoxLocalidad != "")
              filterTable(
                apiOriginal.filter((elem) => elem.ciudad == comboBoxLocalidad)
              );
            else refresh();
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((elem) => {
            return (
              <MenuItem key={elem.id} value={elem.ciudad}>
                {elem.ciudad}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
