import { useContext, useEffect, useState } from "react";
import { MatricesContext } from "../../context/MatricesContext";
import { Autocomplete, Button, TextField } from "@mui/material";

export default function PostHistorialFalloseMatrices() {
  const { getOne, tableOriginal } = useContext(MatricesContext);

  const [codMatriz, setCodMatriz] = useState(null);
    const [descripcionDeterioro, setDescripcionDeterioro] = useState("");

  useEffect(() => {
    if (getOne() != null) 
        setCodMatriz(getOne())
    
    console.log("useEffect");
  },[getOne])

  const handleEnviar = (evt) => {
    evt.preventDefault();
  }

  return (
    <>
      <section className="mt-10 lg:mt-0">
        <h1 className="text-center uppercase font-bold text-lg">Nuevo Error Matriz</h1>
        <form className="flex flex-col items-center justify-center">
          <Autocomplete
            sx={{ margin: 1, width: '100%' , maxWidth: '400px' }}
            options={tableOriginal}
            getOptionLabel={(elem) => elem.cod_matriz}
            value={codMatriz}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(evt, value) => {
              console.log("ON CHANGE", value);
              setCodMatriz(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Cod Matriz" variant="outlined" />
            )}
          />
          <TextField 
            sx={{ width: '100%' , maxWidth: '400px'}}
            multiline
            value={descripcionDeterioro}
            onChange={(evt) => 
                setDescripcionDeterioro(evt.target.value)
            }
            label="Descripcion Falla"
          />
          <Button onSubmit={handleEnviar}>Enviar</Button>
        </form>
      </section>
    </>
  );
}
