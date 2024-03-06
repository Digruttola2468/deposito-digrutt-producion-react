import {
  Autocomplete,
  Button,
  Divider,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { ProducionContext } from "../../context/ProduccionContext";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";
import { PostMatricesContext } from "../../context/PostMatricesContext";
import BoxTurnoProducion from "../comboBox/BoxTurnoProducion";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function PostProduccion() {
  const { token, BASE_URL, refreshTable } = useContext(ProducionContext);
  const { listMatrices, setListMatrices } = useContext(PostMatricesContext);

  const { data, isLoading, error } = useSWR(
    [`${BASE_URL}/inventario/nombres`, token],
    fetcherToken
  );

  const [requesterror, setRequeterror] = useState({ campo: null, index: null });
  const [fecha, setFecha] = useState("");
  const [turnoProduccion, setTurnoProduccion] = useState({});

  useEffect(() => {
    for (let i = 0; i < listMatrices.length; i++) {
      const elemMatriz = listMatrices[i];

      document.querySelector(`#hrMaquina-${elemMatriz.id}`).value =
        turnoProduccion.diferenciaHoras;
    }
  }, [turnoProduccion]);

  const handleSubmitSend = (evt) => {
    evt.preventDefault();

    let enviar = [];
    for (let i = 0; i < listMatrices.length; i++) {
      const elemMatriz = listMatrices[i];

      const numMaquina = evt.target[`numMaquina-${elemMatriz.id}`].value;
      const hrsMaquina = evt.target[`hrMaquina-${elemMatriz.id}`].value;
      const golpes = evt.target[`golpes-${elemMatriz.id}`].value;
      const piezasXGolpe = evt.target[`piezas-${elemMatriz.id}`].value;
      const piezasProducidas = piezasXGolpe * golpes;
      const golpesHora = parseInt(golpes) / parseFloat(hrsMaquina);

      const enviarcodProducto = {
        numMaquina: numMaquina,
        fecha,
        idMatriz: parseInt(elemMatriz.id),
        golpesReales: golpes,
        piezasProducidas: piezasProducidas,
        promGolpesHora: golpesHora,
        idTurno: turnoProduccion.id
      };
      enviar.push(enviarcodProducto);
    }
    
    toast.promise(
      axios
        .post(`${BASE_URL}/producion/list`, enviar, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          refreshTable();
          empty();
        }),
      {
        loading: "Agregando los Datos...",
        success: "Operacion Exitosa",
        error: (err) => {
          setRequeterror({
            campo: err.response.data.campus,
            index: err.response.data.index,
          });
          console.log(err.response.data);

          if (err.response.data.message == "Campo piezas producidas esta vacio")
            return "Campo Piezas x Golpe esta vacio";
          return err.response.data.message;
        },
      }
    );
  };

  const empty = () => {
    setRequeterror({ campo: null, index: null });
    setListMatrices([]);
    setFecha("");
  };

  const handleClickDeletePost = (unique) => {
    const filterList = listMatrices.filter(
      (codProducto) => codProducto.id != unique
    );
    setListMatrices(filterList);
  };

  const emptyRequestError = () => {
    setRequeterror({ campo: null, index: null });
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  const renderPost = (unique, codProducto, index) => {
    const campo = requesterror.index == index ? requesterror.campo : null;
    return (
      <div
        key={unique}
        className="relative flex flex-col mx-2 border p-2 rounded-md hover:translate-x-1 hover:translate-y-1 transition-transform duration-300"
      >
        <div className="flex flex-row">
          <div>
            <h2 className="font-bold uppercase">
              {codProducto.cod_matriz}
              <span className="font-medium text-xs">
                {" " + codProducto.cliente}
              </span>
            </h2>
            <p className="font-semibold text-sm text-gray-400">
              {codProducto.descripcion}
            </p>
          </div>
          <span className="absolute top-0 right-0">
            <Tooltip
              title="Eliminar Item"
              sx={{ alignSelf: "flex-end" }}
              onClick={() => {
                handleClickDeletePost(unique);
              }}
            >
              <IconButton>
                <AiOutlineDelete className="cursor-pointer hover:text-red-500 " />
              </IconButton>
            </Tooltip>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 px-2">
          <TextField
            type="number"
            label="N° Maquina"
            sx={{ margin: 1, width: "100%", maxWidth: "150px" }}
            size="small"
            id={`numMaquina-${unique}`}
            error={campo == "numMaquina" ? true : false}
            onChange={(evt) => {
              if (evt.target.value != "") emptyRequestError();
            }}
          />
          <TextField
            type="number"
            label="Golpes Reales"
            sx={{ margin: 1, width: "100%", maxWidth: "150px" }}
            size="small"
            id={`golpes-${unique}`}
            error={campo == "golpeReale" ? true : false}
            onChange={(evt) => {
              if (evt.target.value != "") emptyRequestError();
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 px-2">
          <TextField
            type="number"
            label="Piezas x Golpe"
            sx={{ margin: 1, width: "100%", maxWidth: "150px" }}
            size="small"
            id={`piezas-${unique}`}
            onChange={(evt) => {
              if (evt.target.value != "") emptyRequestError();
            }}
          />
          <TextField
            type="number"
            value={turnoProduccion?.diferenciaHoras || 0}
            placeholder="Hrs maquina"
            sx={{ margin: 1, width: "100%", maxWidth: "150px" }}
            helperText="Hrs Maquina"
            size="small"
            id={`hrMaquina-${unique}`}
          />
        </div>
      </div>
    );
  };

  return (
    <section className=" flex flex-col justify-start items-center mt-10 ">
      <form
        className="flex flex-col w-full items-center"
        onSubmit={handleSubmitSend}
      >
        <div className="flex flex-row items-center justify-center">
          <TextField
            type="date"
            sx={{ minWidth: "100px" }}
            size="small"
            value={fecha}
            onChange={(evt) => {
              setFecha(evt.target.value);
              emptyRequestError();
            }}
            error={requesterror.campo == "fecha" ? true : false}
          />
          <BoxTurnoProducion
            turnoProducion={turnoProduccion}
            setTurnoProducion={setTurnoProduccion}
            size="small"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
          {listMatrices.map((codProducto, index) => {
            return (
              <div key={codProducto.id}>
                {renderPost(codProducto.id, codProducto, index)}
              </div>
            );
          })}
        </div>
        <div className="flex flex-row justify-center items-center mt-10">
          <Button type="submit" variant="outlined">
            Enviar
          </Button>
        </div>
      </form>
    </section>
  );
}
