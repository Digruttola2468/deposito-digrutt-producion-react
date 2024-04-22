import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

export default function BoxCliente({ cliente, setCliente, size = "small", errorValue = false }) {
  const { BASE_URL } = useContext(UserContext);
  const { data, isLoading, error } = useSWR(
    `${BASE_URL}/clientes`,
    (url) => {
      return axios.get(url).then((result) => result.data.data);
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
          error={errorValue}
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
