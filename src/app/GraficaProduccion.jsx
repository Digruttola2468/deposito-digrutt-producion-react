import { Divider, TextField } from "@mui/material";
import ProduccionLineGrafic from "../components/graficas/LineGraficProduccion";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import TableProduccionSemanal from "./TableProduccionSemanal";

export default function GraficaProduccion() {
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const [fechaInit, setFechaInit] = useState("");
  const [fechaEnd, setFechaEnd] = useState("");

  const [listGraficas, setListGraficas] = useState([]);

  const handleShowGrafic = () => {
    const URL = `${BASE_URL}/grafica/produccion?init=${fechaInit}&end=${fechaEnd}`;
    axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${userSupabase.token}`,
        },
      })
      .then((result) => {
        console.log(result.data);
        setListGraficas(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <section>
        <div className="flex flex-row items-center justify-center">
          <div className="mr-1">
            <TextField
              type="date"
              value={fechaInit}
              onChange={(evt) => {
                const fecha = evt.target.value;
                setFechaInit(fecha);

                if (fecha != "") {
                  if (fechaEnd != "") handleShowGrafic();
                }
              }}
            />
          </div>
          <div className="mr-1">
            <TextField
              type="date"
              value={fechaEnd}
              onChange={(evt) => {
                const fecha = evt.target.value;
                setFechaEnd(fecha);

                if (fecha != "") {
                  if (fechaInit != "") handleShowGrafic();
                }
              }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          {listGraficas.length != 0 ? (
            listGraficas.map((elem, index) => {
              return (
                <div key={index}>
                  <Divider>
                    <h1 className="text-center uppercase text-xl font-bold">
                      {`Maquina ${elem.maquina}`}
                    </h1>
                  </Divider>
                  
                  <div className="flex flex-col lg:flex-row justify-around items-start">
                  <TableProduccionSemanal rangeDate={[fechaInit,fechaEnd]} numMaquina={elem.maquina}/>
                    <ProduccionLineGrafic
                      index={index}
                      listGrafica={elem.grafica}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  );
}
