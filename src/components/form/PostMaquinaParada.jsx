import {
  Autocomplete,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import useSWR from "swr";
import { MaquinaParadaContext } from "../../context/MaquinaParadaContext";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function PostMaquinaParada() {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { postTable } =
    useContext(MaquinaParadaContext);

  const { data, isLoading, error } = useSWR(
    [`${BASE_URL}/motivoMaquinaParada`, userSupabase.token],
    fetcherToken
  );

  const [motivoMaquina, setMotivoMaquina] = useState(null);
  const [hrs, setHrs] = useState("");
  const [numMaquina, setNumMaquina] = useState("");
  const [fecha, setFecha] = useState("");

  const handleClickSend = (evt) => {
    evt.preventDefault();
    const enviar = {
      idMotivoMaquinaParada: motivoMaquina.id,
      hrs,
      idMaquina: numMaquina,
      fecha,
    };

    toast.promise(
      axios
        .post(`${BASE_URL}/maquinaParada`, enviar, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          postTable(result.data.data);
          empty();
        }),
      {
        loading: "Cargando...",
        success: "Operacion Exitosa",
        error: (err) => {
          return err.response.data.message;
        },
      }
    );
  };
  //
  const empty = () => {
    setMotivoMaquina(null);
    setFecha("");
    setHrs("");
    setNumMaquina("");
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <section className="mt-10 lg:mt-0">
      <h1 className="uppercase font-bold text-2xl">Agregar Maquina Parada</h1>
      <form className="flex flex-col">
        <div className="flex flex-row">
          <TextField
            type="number"
            value={numMaquina}
            onChange={(evt) => setNumMaquina(evt.target.value)}
            label="N° Maquina"
            sx={{ margin: 1, width: "100%", maxWidth: "120px" }}
          />
          <Autocomplete
            sx={{ margin: 1, width: "100%", maxWidth: "250px" }}
            options={data}
            getOptionLabel={(elem) => elem.descripcion}
            value={motivoMaquina}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(evt, value) => {
              console.log(value);
              setMotivoMaquina(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Maq Parada" variant="outlined" />
            )}
          />
        </div>

        <div>
          <TextField
            type="date"
            value={fecha}
            onChange={(evt) => setFecha(evt.target.value)}
            sx={{ margin: 1, width: "100%", maxWidth: "150px" }}
          />
          <TextField
            type="number"
            value={hrs}
            onChange={(evt) => setHrs(evt.target.value)}
            label="Hrs Maquina Parada"
            sx={{ margin: 1, width: "100%", maxWidth: "220px" }}
          />
        </div>
        <div className="flex flex-row justify-between max-w-[400px]">
          <Button type="submit" variant="text" onClick={empty}>
            Borrar
          </Button>
          <Button type="submit" variant="outlined" onClick={handleClickSend}>
            Enviar
          </Button>
        </div>
      </form>
    </section>
  );
}
