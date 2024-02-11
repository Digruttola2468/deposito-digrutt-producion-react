import {
  Autocomplete,
  Button,
  Divider,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import useSWR from "swr";
import { ProducionContext } from "../../context/ProduccionContext";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";

const fetcherToken = ([url, token]) => {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((result) => result.data);
};

export default function PostProduccion({ listInventario, setListInventario }) {
  const { token, BASE_URL, refreshTable } = useContext(ProducionContext);

  const { data, isLoading, error } = useSWR(
    [`${BASE_URL}/inventario/nombres`, token],
    fetcherToken
  );

  const [requesterror, setRequeterror] = useState({ campo: null, index: null });
  const [fecha, setFecha] = useState("");

  const handleSubmitSend = (evt) => {
    evt.preventDefault();

    let enviar = [];
    for (let i = 0; i < listInventario.length; i++) {
      const codProductoent = listInventario[i];

      const numMaquina = evt.target[`numMaquina-${codProductoent.id}`].value
      const golpes = evt.target[`golpes-${codProductoent.id}`].value;
      const piezasXGolpe = evt.target[`piezas-${codProductoent.id}`].value;
      const piezasProducidas = piezasXGolpe * golpes;
      const golpesHora = golpes / 24;

      const enviarcodProducto = {
        numMaquina: numMaquina,
        fecha,
        idInventario: parseInt(codProductoent.id),
        golpesReales: golpes,
        piezasProducidas: piezasProducidas,
        promGolpesHora: golpesHora,
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
            return "Campo Piezas x Golpe esta vacio"
          return err.response.data.message;
        },
      }
    );
  };

  const empty = () => {
    setRequeterror({ campo: null, index: null });
    setListInventario([]);
    setFecha("");
  };

  const handleClickDeletePost = (unique) => {
    const filterList = listInventario.filter(
      (codProducto) => codProducto.id != unique
    );
    setListInventario(filterList);
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
          {codProducto.urlImage ? (
            <div>
              <img
                src={codProducto.urlImage}
                alt="img"
                className="w-15 h-10 "
              />
            </div>
          ) : (
            <></>
          )}
          <div>
            <h2 className="font-bold uppercase">
              {codProducto.nombre}
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
        <div className="w-full sm:max-w-[200px] ">
          <TextField
            type="date"
            sx={{ margin: 1, minWidth: "100px" }}
            size="small"
            value={fecha}
            onChange={(evt) => {
              setFecha(evt.target.value);
              emptyRequestError();
            }}
            error={requesterror.campo == "fecha" ? true : false}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
          {listInventario.map((codProducto,index) => {
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
