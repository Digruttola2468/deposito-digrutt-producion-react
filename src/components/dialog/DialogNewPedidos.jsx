import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";
import axios from "axios";
import AutoCompleteInventario from "../autoComplete/AutoCompleteInventario";
import BoxCliente from "../comboBox/BoxCliente";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

export default function DialogNewPedidos({
  show = false,
  close = () => {},
  refreshTable = () => {},
}) {
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const [producto, setProducto] = useState(null);
  const [cliente, setCliente] = useState("");
  const [stock, setStock] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [ordenCompra, setOrdenCompra] = useState("");

  const empty = () => {
    setProducto(null);
    setCliente("");
    setStock("");
    setFechaEntrega("");
  };

  const handleNewPedido = () => {
    toast.promise(
      axios
        .post(
          `${BASE_URL}/pedidos`,
          {
            idinventario: producto != null ? producto.id : null,
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
          refreshTable();
          close();
        }),
      {
        loading: "Creando Pedido...",
        success: "Operacion Exitosa",
        error: (err) => {
          console.log(err);
          return "Ocurrio un error";
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
      <DialogTitle>Nuevo Pedido</DialogTitle>
      <DialogContent className="flex flex-col">
        <BoxCliente size="medium" cliente={cliente} setCliente={setCliente} />
        <AutoCompleteInventario
          producto={producto}
          setProducto={setProducto}
          required={true}
        />
        <TextField
          value={ordenCompra}
          onChange={(event) => setOrdenCompra(event.target.value)}
          label="Orden Compra"
        />
        <TextField
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          label="Cantidad Enviar"
          required
          sx={{ marginTop: 2 }}
        />
        <TextField
          value={fechaEntrega}
          onChange={(event) => setFechaEntrega(event.target.value)}
          type="date"
          required
          sx={{ marginTop: 2 }}
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
        <Button onClick={handleNewPedido} variant="outlined">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}
