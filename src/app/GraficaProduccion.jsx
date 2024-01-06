import { Divider, IconButton, TextField, Tooltip } from "@mui/material";
import ProduccionLineGrafic from "../components/graficas/LineGraficProduccion";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import TableProduccionSemanal from "./TableProduccionSemanal";
import { FaFileExcel } from "react-icons/fa6";
import fileDownload from "js-file-download";

export default function GraficaProduccion() {
  const { BASE_URL, userSupabase } = useContext(UserContext);

  const [fechaInit, setFechaInit] = useState("");
  const [fechaEnd, setFechaEnd] = useState("");

  const [listGraficas, setListGraficas] = useState([]);

  const handleShowGrafic = (fechaInit, fechaEnd) => {
    console.log(fechaInit);
    console.log(fechaEnd);
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

  const handleClickExcel = () => {
    axios({
      url: `${BASE_URL}/excel/produccion-semanal?start=${fechaInit}&end=${fechaEnd}`,
      headers: {
        Authorization: `Bearer ${userSupabase.token}`,
      },
      method: "GET",
      responseType: "blob",
    }).then((res) => {
      fileDownload(res.data, 'ProduccionSemanal.xlsx');
    });
  };

  return (
    <>
      <section>
        <Divider>
          <h1 className="uppercase font-bold text-2xl">Grafica Semanal</h1>
        </Divider>
        <div className="flex flex-row items-center justify-center">
          <div className="mr-1">
            <TextField
              type="date"
              value={fechaInit}
              onChange={(evt) => {
                const fecha = evt.target.value;
                setFechaInit(fecha);

                if (fecha != "") {
                  if (fechaEnd != "") handleShowGrafic(fecha,fechaEnd);
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
                  if (fechaInit != "") handleShowGrafic(fechaInit,fecha);
                }
              }}
            />
          </div>
          <div>
            <Tooltip
              title="Exportar Excel"
              onClick={handleClickExcel}
            >
              <IconButton>
                <FaFileExcel className="hover:text-green-700"/>
              </IconButton>
            </Tooltip>
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
                    <TableProduccionSemanal
                      rangeDate={[fechaInit, fechaEnd]}
                      numMaquina={elem.maquina}
                    />
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
