import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import useSWR from "swr";
import { InventarioContext } from "../../context/InventarioContext";
import { UserContext } from "../../context/UserContext";

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data.data);
};

export default function SearchClientesBox({
  filterTable,
  refresh,
  apiOriginal,
  setCliente = (v) => {}
}) {
  const { BASE_URL } = useContext(UserContext);
  const { data, isLoading, error, mutate } = useSWR(
    `${BASE_URL}/clientes`,
    fetcher
  );

  const [clientesList, setClientesList] = useState("");

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="w-[150px] ml-1">
      <FormControl fullWidth>
        <InputLabel>Cliente</InputLabel>
        <Select
          size="small"
          defaultValue={""}
          value={clientesList}
          label="Cliente"
          onChange={(evt) => {
            const comboBoxCliente = evt.target.value;
            setCliente(comboBoxCliente);

            if (comboBoxCliente != "")
              filterTable(
                apiOriginal.filter((elem) => elem.idcliente == comboBoxCliente)
              );
            else refresh();

            setClientesList(comboBoxCliente);
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((elem) => {
            return (
              <MenuItem key={elem.id} value={elem.id}>
                {elem.cliente}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
