import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function BoxCategoria({
  categoria,
  setCategoria,
  range,
  size = "medium",
}) {
  return (
    <Box className="w-full">
      <FormControl fullWidth>
        <InputLabel>Categoria</InputLabel>
        <Select
          size={size}
          value={categoria}
          label="Categoria"
          onChange={(evt) => setCategoria(evt.target.value)}
        >
          {range.map((elem) => {
            return (
              <MenuItem key={elem.id} value={elem.id}>
                {elem.categoria}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
