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
import { CiSquarePlus } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";

export default function PostProduccion() {
  const { token, base_url, fetcherToken, refreshTable } =
    useContext(ProducionContext);

  const { data, isLoading, error } = useSWR(
    [`${base_url}/inventario/nombres`, token],
    fetcherToken
  );

  const [requesterror, setRequeterror] = useState({ campo: null, index: null });
  const [length, setLength] = useState(0);
  const [list, setList] = useState([{ id: length }]);
  const [fecha, setFecha] = useState("");

  const handleSubmitSend = (evt) => {
    evt.preventDefault();

    let enviar = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];

      const enviarElem = {
        numMaquina: evt.target[`numMaquina-${element.id}`].value,
        fecha,
        idInventario: parseInt(element.codProducto),
        golpesReales: evt.target[`golpes-${element.id}`].value,
        piezasProducidas: evt.target[`piezas-${element.id}`].value,
        promGolpesHora: parseInt(evt.target[`promedio-${element.id}`].value),
      };
      enviar.push(enviarElem);
    }

    toast.promise(
      axios
        .post(`${base_url}/producion/list`, enviar, {
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
            campo: err.response.data.campo,
            index: err.response.data.index,
          });
          return err.response.data.message;
        },
      }
    );
  };

  const empty = () => {
    setRequeterror({ campo: null, index: null })
    setLength(0)
    setList([{ id: length }])
    setFecha("")
  }

  const handleClickAddPost = () => {
    const increment = length + 1;
    setLength(increment);
    list.push({ id: increment });
    setList(list);
  };
  const handleClickDeletePost = (unique) => {
    const decrement = length - 1;
    setLength(decrement);
    const filterList = list.filter((elem) => elem.id != unique);
    setList(filterList);
  };

  const emptyRequestError = () => {
    setRequeterror({ campo: null, index: null });
  };

  const renderPost = (unique) => {
    const campo = requesterror.index == unique ? requesterror.campo : null;
    return (
      <>
        <div
          key={unique}
          className="flex flex-col sm:flex-row items-start sm:items-center"
        >
          <div className="flex flex-col lg:flex-row">
            <div>
              <TextField
                type="number"
                label="N° Maquina"
                sx={{ margin: 1 }}
                size="small"
                id={`numMaquina-${unique}`}
                error={campo == "numMaquina" ? true : false}
                onChange={(evt) => {
                  if (evt.target.value != "") emptyRequestError();
                }}
              />
            </div>
            <div>
              <Autocomplete
                sx={{ margin: 1, width: "200px" }}
                options={data}
                getOptionLabel={(elem) => elem.nombre}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(evt, value) => {
                  const result = list.map((elem) => {
                    if (elem.id === unique)
                      return { ...elem, codProducto: value ? value.id : null };
                    else return elem;
                  });
                  emptyRequestError();
                  setList(result);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cod Producto"
                    variant="outlined"
                    error={campo == "idInventario" ? true : false}
                  />
                )}
                size="small"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div>
              <TextField
                type="number"
                label="Golpes Reales"
                sx={{ margin: 1, width: "140px" }}
                size="small"
                id={`golpes-${unique}`}
                error={campo == "golpeReale" ? true : false}
                onChange={(evt) => {
                  if (evt.target.value != "") emptyRequestError();
                }}
              />
              <TextField
                type="number"
                label="Piezas Producidas"
                sx={{ margin: 1, width: "160px" }}
                size="small"
                id={`piezas-${unique}`}
                error={campo == "piezasProducidas" ? true : false}
                onChange={(evt) => {
                  if (evt.target.value != "") emptyRequestError();
                }}
              />
            </div>
            <div>
              <TextField
                type="number"
                label="Promedio Golpes/hr"
                sx={{ margin: 1 }}
                size="small"
                error={campo == "promGolpHr" ? true : false}
                onChange={(evt) => {
                  if (evt.target.value != "") emptyRequestError();
                }}
                id={`promedio-${unique}`}
              />
            </div>
          </div>
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
        </div>
        <Divider />
      </>
    );
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <section className=" flex flex-col justify-center items-center mt-10">
      <Divider className="w-full">
        <h1 className="uppercase text-2xl font-bold">Agregar Producion</h1>
      </Divider>
      <div className="max-w-[1200px]">
        <form className="flex flex-col" onSubmit={handleSubmitSend}>
          <div className="w-full sm:max-w-[200px]">
            <TextField
              type="date"
              sx={{ margin: 1, width: "100%" }}
              size="small"
              value={fecha}
              onChange={(evt) => {
                setFecha(evt.target.value);
                emptyRequestError();
              }}
              error={requesterror.campo == "fecha" ? true : false}
            />
          </div>
          {list.map((elem) => {
            return <div key={elem.id}>{renderPost(elem.id)}</div>;
          })}

          <div className="flex flex-row justify-between mt-10">
            <span>
              <Tooltip
                title="Agregar Nuevo Produccion"
                onClick={handleClickAddPost}
              >
                <IconButton>
                  <CiSquarePlus className="cursor-pointer hover:text-blue-500 " />
                </IconButton>
              </Tooltip>
            </span>
            <Button type="submit" variant="outlined">
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
