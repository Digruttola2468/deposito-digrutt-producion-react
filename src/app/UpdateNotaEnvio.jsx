import { useContext, useEffect, useState } from "react";
import { NotaEnvioContext } from "../context/NotaEnvioContext";
import { Divider, TextField } from "@mui/material";
import BoxCliente from "../components/comboBox/BoxCliente";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function UpdateNotaEnvio() {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { index, indexMercaderia, setIndex, setIndexMercaderia, updateTable } =
    useContext(NotaEnvioContext);

  const [numeroEnvio, setNumeroEnvio] = useState("");
  const [fecha, setFecha] = useState("");
  const [total, setTotal] = useState("");
  const [cliente, setCliente] = useState("");

  const [requestError, setRequestError] = useState({ campus: null });

  const emptyRequestError = (campus) => {
    if (requestError.campus == campus) setRequestError({ campus: null });
  };

  useEffect(() => {
    if (index != null) {
      setNumeroEnvio(index.nro_envio);
      setTotal(index.valorDeclarado);
      setCliente(index.idcliente);
    }
  }, [index]);

  const handleClickUpdateNotaEnvio = () => {
    let enviar = {
      fecha: null,
      nro_envio: null,
      cliente: null,
      products: null,
    };

    const listSendMercaderia = [];
    for (let i = 0; i < indexMercaderia.length; i++) {
      const mercaderia = indexMercaderia[i];

      let stock = document.querySelector(`#stock-${mercaderia.id}`).value;

      if (stock == "") stock = null;

      listSendMercaderia.push({
        idMercaderia: mercaderia.id,
        stock: stock,
      });
    }

    enviar.products = listSendMercaderia;
    enviar.fecha = fecha != "" ? fecha : null;
    enviar.nro_envio = numeroEnvio;
    enviar.cliente = cliente;

    toast.promise(
      axios
        .put(`${BASE_URL}/facturaNegro/${index.id}`, enviar, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          updateTable(result.data.data)
          setIndex(null);
          setIndexMercaderia([]);
        }),
      {
        loading: "Actualizando...",
        success: "Operacion Exitosa",
        error: (err) => {
          setRequestError({ campus: err.response.data.campus });
          return err.response.data.message;
        },
      }
    );
  };

  if (index == null) return <h1>Seleccione una Nota Envio</h1>;

  return (
    <section>
      <Divider>
        <h1 className="uppercase my-4 font-bold text-lg">
          Update Nota Envio {index.nro_envio}
        </h1>
      </Divider>
      <div className="flex flex-col md:flex-row items-center justify-around gap-4">
        <div>
          <div className="flex flex-col gap-3">
            <TextField
              label="Nro Envio"
              value={numeroEnvio}
              onChange={(evt) => {
                emptyRequestError("nroEnvio");
                setNumeroEnvio(evt.target.value);
              }}
              error={requestError.campus == "nroEnvio" ? true : false}
            />
            <TextField
              type="date"
              value={fecha}
              onChange={(evt) => setFecha(evt.target.value)}
            />
            <BoxCliente
              cliente={cliente}
              setCliente={setCliente}
              size="medium"
            />
            <TextField
              label="Total Declarado"
              value={total}
              onChange={(evt) => setTotal(evt.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {indexMercaderia.length != 0 &&
            indexMercaderia.map((elem) => {
              return (
                <div
                  key={elem.id}
                  className="flex flex-col border border-gray-400 p-2 rounded-md my-2"
                >
                  <div>
                    <h2 className="font-bold uppercase">{elem.nombre}</h2>
                    <p className="font-semibold text-sm text-gray-400">
                      {elem.descripcion.length >= 30
                        ? elem.descripcion.slice(0, 40)
                        : elem.descripcion}
                    </p>
                  </div>
                  <div className="my-2">
                    <TextField
                      type="number"
                      label="Cantidad"
                      defaultValue={elem.stock}
                      id={`stock-${elem.id}`}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <button
          onClick={handleClickUpdateNotaEnvio}
          className=" max-w-[300px] text-center mt-3 px-6 py-3 rounded-lg bg-blue-500 text-white border-2 border-gray-200 gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
        >
          Update
        </button>
      </div>
    </section>
  );
}
