import { useContext, useEffect, useState } from "react";
import { RemitosContext } from "../context/RemitosContext";
import { Divider, TextField } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function UpdateRemito() {
  const { BASE_URL, userSupabase } = useContext(UserContext);
  const { index, indexMercaderia, setIndex, setIndexMercaderia, updateTable } =
    useContext(RemitosContext);

  const [requestError, setRequestError] = useState({ campus: null });

  const emptyRequestError = (campus) => {
    if (requestError.campus == campus) setRequestError({ campus: null });
  };

  const [numRemito, setNumRemito] = useState("");
  const [fecha, setFecha] = useState("");
  const [total, setTotal] = useState("");

  useEffect(() => {
    if (index != null) {
      setNumRemito(index.num_remito);
      setTotal(index.total);
    }
  }, [index]);

  const HandleClickUpdateRemito = () => {
    let enviar = {
      fecha: null,
      numRemito: null,
      nroOrden: null,
      products: null,
      valorDeclarado: null,
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
    enviar.numRemito = numRemito;
    enviar.valorDeclarado = total;

    toast.promise(
      axios
        .put(`${BASE_URL}/remito/${index.id}`, enviar, {
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

  if (index == null) return <h1>Seleccione un Remito</h1>;

  return (
    <section>
      <Divider>
        <h1 className="uppercase my-4 font-bold text-lg">
          Update Remito {index.num_remito}
        </h1>
      </Divider>
      <div className="flex flex-col md:flex-row items-center justify-around gap-4">
        <div>
          <div className="flex flex-col gap-3">
            <TextField
              label="Nro Remito"
              value={numRemito}
              error={requestError.campus == "nroRemito" ? true : false}
              onChange={(evt) => {
                emptyRequestError("nroRemito");
                setNumRemito(evt.target.value);
              }}
            />
            <TextField
              type="date"
              value={fecha}
              onChange={(evt) => setFecha(evt.target.value)}
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
          onClick={HandleClickUpdateRemito}
          className=" max-w-[300px] text-center mt-3 px-6 py-3 rounded-lg bg-blue-500 text-white border-2 border-gray-200 gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
        >
          Update
        </button>
      </div>
    </section>
  );
}
