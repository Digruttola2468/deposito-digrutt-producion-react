import { useContext, useEffect, useState } from "react";
import { MatricesContext } from "../../context/MatricesContext";
import { Autocomplete, Avatar, Button, Icon, TextField } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { UserContext } from "../../context/UserContext";

import toast from "react-hot-toast";
import BoxCategoria from "../comboBox/BoxCategoria";
import { HistorialMatrizContext } from "../../context/HistorialMatrizContext";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function PostHistorialFalloseMatrices() {
  const { userSupabase, BASE_URL } = useContext(UserContext);
  const { index: apiOne } = useContext(MatricesContext);
  const { postTable } = useContext(HistorialMatrizContext);

  const [requestError, setRequestError] = useState({ campus: null });

  const emptyRequestError = (campus) => {
    if (requestError.campus == campus) setRequestError({ campus: null });
  };

  const { data, isLoading, error, mutate } = useSWR(
    [
      `https://deposito-digrutt-express-production.up.railway.app/api/matrices`,
      userSupabase.token,
    ],
    fetcherToken
  );

  const [codMatriz, setCodMatriz] = useState(null);
  const [descripcionDeterioro, setDescripcionDeterioro] = useState("");
  const [categoria, setCategoria] = useState("3");

  useEffect(() => {
    if (apiOne != null) setCodMatriz(apiOne);
  }, [apiOne]);

  const handleEnviar = (evt) => {
    evt.preventDefault();

    toast.promise(
      axios
        .post(
          `${BASE_URL}/historialMatriz`,
          {
            idMatriz: codMatriz?.id ?? null,
            descripcion_deterioro: descripcionDeterioro,
            idCategoria: categoria,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          postTable(result.data.data);
          setCodMatriz(null);
          setDescripcionDeterioro("");
          setCategoria("3");
        }),
      {
        loading: "Cargando...",
        success: "Se agrego con exito",
        error: (err) => {
          setRequestError({ campus: err.response.data.campus });
          return err.response.data.message;
        },
      }
    );
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <>
      <section className="mt-10 lg:mt-0 max-w-[400px]">
        <h1 className="text-center uppercase font-bold text-lg my-2">
          Nuevo Error Matriz
        </h1>
        <form className="flex flex-col items-center justify-center">
          <BoxCategoria
            categoria={categoria}
            setCategoria={setCategoria}
            range={[
              { id: 3, categoria: "Mantenimiento" },
              { id: 4, categoria: "Falla" },
            ]}
          />
          <Autocomplete
            sx={{ margin: 1, width: "100%", maxWidth: "400px" }}
            options={data}
            getOptionLabel={(elem) => elem.cod_matriz}
            value={codMatriz}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(evt, value) => {
              emptyRequestError('matriz');
              setCodMatriz(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Cod Matriz" variant="outlined" error={requestError.campus == "matriz" ? true : false} />
            )}
          />
          <TextField
            sx={{ width: "100%", maxWidth: "400px" }}
            multiline
            value={descripcionDeterioro}
            onChange={(evt) => {emptyRequestError('descripcion');setDescripcionDeterioro(evt.target.value)}}
            label="Descripcion Falla"
            rows={2}
            error={requestError.campus == "descripcion" ? true : false}
          />
          <Button onClick={handleEnviar}>Enviar</Button>
        </form>
      </section>
    </>
  );
}
