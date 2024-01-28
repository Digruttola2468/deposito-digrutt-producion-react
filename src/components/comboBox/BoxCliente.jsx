import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import useSWR from "swr";

export default function BoxCliente({ cliente, setCliente, size = "small" }) {
  const { data, isLoading, error } = useSWR(
    `https://deposito-digrutt-express-production.up.railway.app/api/clientes`,
    (url) => {
      return axios.get(url).then((result) => result.data);
    }
  );

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <Box className="min-w-[150px]">
      <FormControl fullWidth>
        <InputLabel>Cliente</InputLabel>
        <Select
          size={size}
          value={cliente}
          label="Cliente"
          onChange={(evt) => setCliente(evt.target.value)}
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
