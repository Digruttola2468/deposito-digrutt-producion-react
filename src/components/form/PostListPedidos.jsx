import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import useSWR from "swr";
import { PedidosContext } from "../../context/PedidosContext";

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data);
};

export default function PostListPedidos({
  listInventario,
  setListInventario,
  cliente,
  setCliente,
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { refreshTable } = useContext(PedidosContext);

  const { data, error, isLoading } = useSWR(`${BASE_URL}/clientes`, fetcher);

  //Campos List Pedidos
  const [fecha, setFecha] = useState("");
  const [nroOrden, setNroOrden] = useState("");

  useEffect(() => {
    if (cliente != null && cliente != "") {
      const filterByCliente = listInventario.filter(
        (list) => list.idcliente == cliente
      );
      setListInventario(filterByCliente);
    }
  }, [cliente]);

  const empty = () => {
    setFecha("");
    setCliente("");
    setNroOrden("");
    setListInventario([]);
  };

  const getDataListPedido = () => {
    let list = [];
    for (let i = 0; i < listInventario.length; i++) {
      const codProductoArray = listInventario[i];

      const idProduct = codProductoArray.id;

      const cantidadEnviar = document.querySelector(
        `#cantidadEnviar-${idProduct}`
      ).value;
      const fecha = document.querySelector(`#fecha-${idProduct}`).value;

      list.push({
        fechaEntrega: fecha,
        cantidadEnviar,
        idProduct,
        ...codProductoArray,
      });
    }
    return list;
  };

  const handleClickSend = () => {
    let enviar = {};
    enviar.fechaEntrega = fecha;
    enviar.idCliente = cliente;
    enviar.nroOrden = nroOrden;
    enviar.products = getDataListPedido();

    toast.promise(
      axios
        .post(`${BASE_URL}/pedidos/list`, enviar, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          refreshTable();
          empty();
        }),
      {
        loading: "Enviando...",
        success: "Operacion Exitosa",
        error: (err) => err.response?.data.message ?? "",
      }
    );
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <section className="flex flex-col justify-start items-center gap-5 mt-4">
      <section className="grid place-content-center ">
        <div className="mt-3 w-[300px]">
          <Box>
            <FormControl fullWidth>
              <InputLabel>Cliente *</InputLabel>
              <Select
                required
                value={cliente}
                label="Cliente *"
                onChange={(evt) => {
                  const comboBoxCliente = evt.target.value;
                  setCliente(comboBoxCliente);

                  //Filtrar los elementos seleccionados
                  const filterByCliente = listInventario.filter(
                    (list) => list.idcliente == comboBoxCliente
                  );
                  setListInventario(filterByCliente);
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
        </div>
        <div className="mt-2 w-[300px]">
          <TextField
            label="N° Orden"
            value={nroOrden}
            onChange={(evt) => setNroOrden(evt.target.value)}
            sx={{}}
            className="w-full"
          />
        </div>
      </section>
      <section className="flex flex-col">
        <form
          action=""
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3"
        >
          {listInventario.map((elem) => {
            const stockActual = elem.entrada - elem.salida;
            return (
              <div
                key={elem.id}
                className="relative flex flex-col justify-between border p-2 rounded-md max-w-[250px] hover:translate-x-1 hover:translate-y-1 transition-transform duration-300"
              >
                <div className="flex flex-row">
                  {elem.urlImage ? (
                    <div>
                      <img
                        src={elem.urlImage}
                        alt="img"
                        className="w-15 h-10 "
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div>
                    <h2 className="font-bold uppercase">
                      {elem.nombre}
                      <span className="font-medium text-xs">
                        {" " + elem.cliente}
                      </span>
                    </h2>
                    <p className="font-semibold text-sm text-gray-400">
                      {elem.descripcion}
                    </p>
                    <p className="font-semibold text-sm text-gray-400">
                      <b>Stock Actual: </b>
                      <span
                        className={
                          stockActual > 0 ? "text-green-400" : "text-red-400"
                        }
                      >
                        {stockActual}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="mr-4 min-w-[100px]">
                    <TextField
                      type="date"
                      required
                      className="w-full"
                      id={`fecha-${elem.id}`}
                    />
                  </div>
                  <div className="mr-4 min-w-[100px]">
                    <TextField
                      label="Cantidad Enviar"
                      type="number"
                      variant="standard"
                      required
                      id={`cantidadEnviar-${elem.id}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </form>
        {listInventario.length != 0 && (
          <div className="flex flex-row justify-self-start my-2">
            <button
              onClick={() => handleClickSend()}
              className="ml-2 px-6 py-3 rounded-lg bg-blue-500 text-white border-2 border-gray-200 gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
            >
              Agregar Pedidos
            </button>
          </div>
        )}
      </section>
    </section>
  );
}
