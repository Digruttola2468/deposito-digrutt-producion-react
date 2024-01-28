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
  refreshTable = () => {},
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { updateTable } = useContext(PedidosContext);

  const [producto, setProducto] = useState(null);
  const [cliente, setCliente] = useState("");
  const [stock, setStock] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");

  useEffect(() => {
    if (index != null) {
      setCliente(index.idcliente);
      setStock(index.stock);
      setFechaEntrega(index.fecha_entrega);
    }
  }, [index]);

  const empty = () => {
    setProducto(null);
    setCliente("");
    setStock("");
    setFechaEntrega("");
  };

  const handleUpdate = () => {
    toast.promise(
      axios
        .put(
          `${BASE_URL}/pedidos/${index.id}`,
          {
            idinventario: producto?.id ?? null,
            idcliente: cliente,
            stock,
            fecha_entrega: fechaEntrega,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          updateTable(index.id, result.data.update);
          refreshTable();
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
          label="Cantidad Enviar"
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
