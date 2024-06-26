import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";
import AutoCompleteInventario from "../autoComplete/AutoCompleteInventario";
import BoxCliente from "../comboBox/BoxCliente";
import { PedidosContext } from "../../context/PedidosContext";

export default function DialogUpdatePedido({
  show = false,
  close = () => {},
  index,
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { updateTable } = useContext(PedidosContext);

  const [producto, setProducto] = useState(null);
  const [cliente, setCliente] = useState("");
  const [stock, setStock] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [ordenCompra, setOrdenCompra] = useState("");
  const [cantidadEnviada, setCantidadEnviada] = useState("");

  useEffect(() => {
    if (index != null) {
      setCliente(index.idcliente);
      setStock(index.cantidadEnviar);
      setFechaEntrega(index.fecha_entrega);
      setOrdenCompra(index.ordenCompra);
    }
  }, [index]);

  const empty = () => {
    setProducto(null);
    setCliente("");
    setStock("");
    setFechaEntrega("");
    setOrdenCompra("");
  };

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/pedidos/${index.id}`,
          {
            idInventario: parseInt(producto?.id) ?? null,
            idcliente: parseInt(cliente),
            cantidadEnviar: parseInt(stock),
            fecha_entrega: fechaEntrega,
            ordenCompra,
            cantidadEnviada: parseInt(cantidadEnviada),
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          updateTable(index.id, result.data.update);
          empty();
          close();
        }),
      {
        loading: "Actualizando...",
        success: "Operacion Exitosa",
        error: (err) => {
          console.log(err);
          return "Ocurrio un Error";
        },
      }
    );
  };

  return (
    <Dialog
      open={show}
      onClose={() => {
        empty();
        close();
      }}
    >
      <DialogTitle>Actualizar Pedido</DialogTitle>
      <DialogContent className="flex flex-col">
        <AutoCompleteInventario producto={producto} setProducto={setProducto} />
        <BoxCliente cliente={cliente} setCliente={setCliente} size="medium" />
        <TextField
          sx={{ marginTop: 2 }}
          label="Cantidad a Enviar"
          value={stock}
          type="number"
          onChange={(evt) => setStock(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 2 }}
          value={fechaEntrega}
          type="date"
          onChange={(evt) => setFechaEntrega(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 2 }}
          value={ordenCompra}
          label="Orden Compra"
          onChange={(evt) => setOrdenCompra(evt.target.value)}
        />
        <TextField
          sx={{ marginTop: 2 }}
          value={cantidadEnviada}
          label="Cantidad Enviada"
          onChange={(evt) => setCantidadEnviada(evt.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            empty();
            close();
          }}
          variant="text"
        >
          Cancelar
        </Button>
        <Button onClick={handleUpdate} variant="outlined">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
