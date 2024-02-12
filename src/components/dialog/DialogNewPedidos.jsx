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
import { PedidosContext } from "../../context/PedidosContext";

export default function DialogNewPedidos({ show = false, close = () => {} }) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { postTable } = useContext(PedidosContext);

  const [producto, setProducto] = useState(null);
  const [cliente, setCliente] = useState("");
  const [stock, setStock] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [ordenCompra, setOrdenCompra] = useState("");

  const [requestError, setRequestError] = useState({ campus: null });

  const emptyRequestError = (campus) => {
    if (requestError.campus == campus) setRequestError({ campus: null });
  };

  const empty = () => {
    setProducto(null);
    setCliente("");
    setStock("");
    setFechaEntrega("");
    setRequestError();
  };

  const handleNewPedido = () => {
    toast.promise(
      axios
        .post(
          `${BASE_URL}/pedidos`,
          {
            idInventario: producto != null ? producto.id : null,
            idcliente: cliente,
            cantidadEnviar: stock,
            fecha_entrega: fechaEntrega,
          },
          {
            headers: {
              Authorization: `Bearer ${userSupabase.token}`,
            },
          }
        )
        .then((result) => {
          postTable(result.data.data);
          close();
        }),
      {
        loading: "Creando Pedido...",
        success: "Operacion Exitosa",
        error: (err) => {
          console.log(err.response.data.campus);
          setRequestError({ campus: err.response.data.campus });
          return err.response.data.message;
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
        <BoxCliente size="medium" cliente={cliente} setCliente={(value) => {emptyRequestError('cliente');setCliente(value)}} errorValue={requestError.campus == 'cliente' ? true : false} />
        <AutoCompleteInventario
          producto={producto}
          setProducto={(value) => {
            emptyRequestError("idInventario");
            setProducto(value);
          }}
          required={true}
          errorValue={requestError.campus == "idInventario" ? true : false}
        />
        <TextField
          value={ordenCompra}
          onChange={(event) => setOrdenCompra(event.target.value)}
          label="Orden Compra"
        />
        <TextField
          value={stock}
          onChange={(event) => {emptyRequestError('cantidadEnviar');setStock(event.target.value)}}
          label="Cantidad Enviar"
          required
          sx={{ marginTop: 2 }}
          error={requestError.campus == 'cantidadEnviar' ? true : false}
        />
        <TextField
          value={fechaEntrega}
          onChange={(event) => {
            emptyRequestError("fechaEntrega");
            setFechaEntrega(event.target.value);
          }}
          type="date"
          required
          sx={{ marginTop: 2 }}
          error={requestError.campus == "fechaEntrega" ? true : false}
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
