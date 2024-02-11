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

const fetcher = (url) => {
  return axios.get(url).then((result) => result.data);
};

export default function PostRemito({ listInventario, setListInventario }) {
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const { data, error, isLoading } = useSWR(`${BASE_URL}/clientes`, fetcher);

  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [listPedidosDialog, setListPedidosDialog] = useState([]);

  //Campos Remito
  const [numRemito, setNumRemito] = useState("");
  const [fecha, setFecha] = useState("");
  const [cliente, setCliente] = useState("");
  const [nroOrden, setNroOrden] = useState("");
  const [valorDeclarado, setValorDeclarado] = useState(0);

  //View PDF
  const [viewPdf, setViewPdf] = useState(false);

  const getDataListPedido = () => {
    let list = [];
    let valorDeclarado = 0;
    for (let i = 0; i < listInventario.length; i++) {
      const codProductoArray = listInventario[i];

      let idProduct = codProductoArray.id;

      let stock = document.querySelector(`#stock-${codProductoArray.id}`).value;
      let precioUnidad = document.querySelector(
        `#precioUnidad-${codProductoArray.id}`
      ).value;

      if (stock == "") stock = 1;
      if (stock <= 0) stock = 1;

      if (precioUnidad == "" || precioUnidad <= 0) precioUnidad = 0;

      const precio = parseFloat(precioUnidad * stock);
      valorDeclarado += precio;

      list.push({ stock, idProduct, precio, ...codProductoArray });
    }
    setValorDeclarado(valorDeclarado);
    setListPedidosDialog(list);

    return list;
  };

  const handleClickSend = (evt) => {
    evt.preventDefault();

    let enviar = {};
    enviar.fecha = fecha;
    enviar.numRemito = numRemito;
    enviar.idCliente = cliente;
    enviar.nroOrden = nroOrden;
    enviar.products = getDataListPedido();
    enviar.valorDeclarado = valorDeclarado;

    toast.promise(
      axios
        .post(`${BASE_URL}/remito`, enviar, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          console.log(result);
          empty();
        }),
      {
        loading: "Enviando...",
        success: (data) => data.data.message,
        error: (err) => err.response?.data.message ?? "",
      }
    );
    setDialogConfirm(false);
  };
  /*
  const handleClickShowPdf = (evt) => {
    evt.preventDefault();

    let enviar = {};
    enviar.fecha = fecha;
    enviar.numRemito = numRemito;
    enviar.idCliente = cliente;
    enviar.nroOrden = nroOrden;
    enviar.products = [];

    let valorDeclarado = 0;
    for (let i = 0; i < pedidos.length; i++) {
      const codProductoArray = pedidos[i];
      console.log(codProductoArray);

      let idProduct = codProductoArray.id;

      let stock = document.querySelector(`#stock-${codProductoArray.id}`).value;

      let precio = document.querySelector(
        `#precio-${codProductoArray.id}`
      ).value;

      if (stock == "") stock = 1;
      if (stock <= 0) stock = 1;

      if (precio == "") precio = 0;
      if (precio <= 0) precio = 0;

      valorDeclarado += parseFloat(precio);
      enviar.products.push({ stock, idProduct, precio });
    }
    enviar.valorDeclarado = valorDeclarado;

    setListProducts(enviar.products);
  };
*/
  const empty = () => {
    setNumRemito("");
    setFecha("");
    setCliente("");
    setNroOrden("");
    setListInventario([]);
    setViewPdf(false);
  };

  if (isLoading) return <></>;
  if (error) return <></>;

  return (
    <>
      <section className="flex flex-col justify-start items-center gap-5 mt-4">
        <section className="grid place-content-center ">
          <div className="w-[300px] ">
            <TextField
              label="N° Remito"
              value={numRemito}
              type="number"
              placeholder="N° Remito"
              onChange={(evt) => setNumRemito(evt.target.value)}
              className="w-full"
            />
          </div>

          <div className="mt-2 w-[300px]">
            <TextField
              type="date"
              value={fecha}
              onChange={(evt) => setFecha(evt.target.value)}
              sx={{}}
              className="w-full"
            />
          </div>
          <div className="mt-3 w-[300px]">
            <Box>
              <FormControl fullWidth>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={cliente}
                  label="Cliente"
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
                  <div className="flex flex-row">
                    <div className="mr-4 max-w-[100px]">
                      <TextField
                        label="Cantidad"
                        type="number"
                        variant="standard"
                        id={`stock-${elem.id}`}
                      />
                    </div>
                    <div className="mr-4 max-w-[100px]">
                      <TextField
                        label="Precio x Unidad"
                        type="number"
                        variant="standard"
                        id={`precioUnidad-${elem.id}`}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
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
                onClick={() => {
                  setDialogConfirm(true);
                  getDataListPedido();
                }}
                className="ml-2 px-6 py-3 rounded-lg bg-blue-500 text-white border-2 border-gray-200 gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
              >
                Enviar
              </button>
              <button
                onClick={() => {}}
                className="ml-2 p-3  gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
              >
                Agregar PDF
              </button>
            </div>
          )}
        </section>
      </section>
      <Dialog open={dialogConfirm} onClose={() => setDialogConfirm(false)}>
        <DialogTitle>Confirmar Remito</DialogTitle>
        <DialogContent>
          <div className="flex flex-col sm:flex-row">
            <p className="px-1 font-semibold text-lg text-gray-400">
              {numRemito}
            </p>
            <p className="px-1 font-semibold text-lg text-gray-400">{fecha}</p>
            <p className="px-1 font-semibold text-lg uppercase text-gray-400">
              {cliente}
            </p>
          </div>
          <Divider />
          {listPedidosDialog.map((elem) => {
            const stockActual = elem.entrada - elem.salida;
            return (
              <div key={elem.id}>
                <div className="my-2">
                  <div className="flex flex-row">
                    {elem.urlImage ? (
                      <div>
                        <img src={elem.urlImage} alt="" className="w-15 h-10" />
                      </div>
                    ) : (
                      <></>
                    )}
                    <div>
                      <h2 className="font-bold uppercase">{elem.nombre} </h2>
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

                  <div className="flex flex-row justify-between">
                    <p> stock:{" " + elem.stock} </p>
                    <p> $ {elem.precio} </p>
                  </div>
                </div>
                <Divider />
              </div>
            );
          })}
          <p className="font-semibold text-lg text-end">
            <span className="font-semibold text-lg text-gray-400">
              Total Declarado{" "}
            </span>
            ${valorDeclarado}
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogConfirm(false)}>Cancelar</Button>
          <Button onClick={handleClickSend} variant="outlined">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**<section className="mt-5">
        <button
          onClick={() => setViewPdf(!viewPdf)}
          className="ml-2 p-3 rounded-lg border-2 border-gray-200 gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
        >
          Ver PDF
        </button>
        <PDFDownloadLink
          document={
            <DocRemitoPdf
              CUIT={getClienteById(cliente).cuit || ""}
              cliente={getClienteById(cliente).cliente || ""}
              fecha={fecha || ""}
              domicilio={getClienteById(cliente).domicilio || ""}
              nroOrden={nroOrden || ""}
              products={listProducts}
              listAllProducts={inventarioNombres}
            />
          }
          fileName="remito.pdf"
        >
          <button className="ml-2 p-3 rounded-lg border-2 border-gray-200 gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out">
            DOWNLOAD PDF
          </button>
        </PDFDownloadLink>
        {viewPdf ? (
          <PDFViewer className="w-full h-screen">
            <DocRemitoPdf
              CUIT={getClienteById(cliente).cuit || ""}
              cliente={getClienteById(cliente).cliente || ""}
              fecha={fecha || ""}
              domicilio={getClienteById(cliente).domicilio || ""}
              nroOrden={nroOrden || ""}
              products={listProducts}
              listAllProducts={inventarioNombres}
            />
          </PDFViewer>
        ) : (
          <></>
        )}

        
      </section> */
