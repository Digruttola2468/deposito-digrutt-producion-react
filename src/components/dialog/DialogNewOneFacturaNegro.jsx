import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import AutoCompleteInventario from "../autoComplete/AutoCompleteInventario";
import { NotaEnvioContext } from "../../context/NotaEnvioContext";

export default function DialogNewOneFacturaNegro({ open, close }) {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { index } = useContext(NotaEnvioContext);

  const [codProducto, setCodProducto] = useState(null);
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  const handleUpdate = async () => {
    if (codProducto != null) {
      const idNotaEnvio = index.id;
      toast.promise(
        axios
          .put(
            `${BASE_URL}/facturaNegro/${idNotaEnvio}/newProduct`,
            [
              {
                stock: stock == "" ? 1 : stock,
                price: price == "" ? 0 : price,
                idInventario: codProducto.id,
              },
            ],
            {
              headers: {
                Authorization: `Bearer ${userSupabase.token}`,
              },
            }
          )
          .then((result) => {
            close();
            empty();
          }),
        {
          loading: "Agregando...",
          success: "Operacion Exitosa",
          error: (err) => {
            return err.response.data.message;
          },
        }
      );
    } else toast.error("Campo Cod Producto Vacio");
  };

  const empty = () => {
    setCodProducto(null);
    setStock("");
    setPrice("");
  };

  return (
    <Dialog open={open} onClose={() => close(false)}>
      <DialogTitle>Agregar Nueva Mercaderia</DialogTitle>
      <DialogContent className="flex flex-col">
        {codProducto && (
          <div>
            <div className="my-2">
              <div className="flex flex-row">
                {codProducto.urlImage ? (
                  <div>
                    <img
                      src={codProducto.urlImage}
                      alt=""
                      className="w-15 h-10"
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div>
                  <h2 className="font-bold uppercase">{codProducto.nombre} </h2>
                  <p className="font-semibold text-sm text-gray-400">
                    {codProducto.descripcion}
                  </p>
                  <p className="font-semibold text-sm text-gray-400">
                    <b>Stock Actual: </b>
                    <span
                      className={
                        codProducto.entrada - codProducto.salida > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {codProducto.entrada - codProducto.salida}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <Divider sx={{ marginY: "4px" }} />
          </div>
        )}
        <AutoCompleteInventario
          producto={codProducto}
          setProducto={setCodProducto}
          required={true}
          sx={{ width: "200px", margin: "6px" }}
        />
        <TextField
          label={"Stock"}
          type="number"
          value={stock}
          onChange={(evt) => setStock(evt.target.value)}
          variant="outlined"
          sx={{ margin: 1, width: "200px" }}
        />
        <TextField
          label={"Precio"}
          type="number"
          value={price}
          onChange={(evt) => setPrice(evt.target.value)}
          variant="outlined"
          sx={{ margin: 1, width: "200px" }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close(false)} variant="text">
          Cancelar
        </Button>
        <Button onClick={handleUpdate} autoFocus variant="outlined">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
