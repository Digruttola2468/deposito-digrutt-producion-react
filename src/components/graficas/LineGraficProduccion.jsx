import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useEffect, useState } from "react";
import { Button, Divider } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProduccionLineGrafic({
  index,
  listGrafica = []
}) {
  const semana = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  const colores = ["green", "red", "blue"];

  const [showButton, setShowButton] = useState({id: index, show: true})

  const [grafica, setGrafica] = useState(() => {
    const list = [];
    // Se modifica las opciones para los datasets
    listGrafica.forEach((elem, index) => {
      list.push({ ...elem, borderColor: colores[index] });
    });
    return list;
  });

  const config = {
    type: "line",
    data: {
      labels: semana,
      datasets: grafica,
    },
    options: {
      //  responsive: true,
      maintainAspectRatio: false,
    },
  };

  const handle = () => {
    setShowButton({id: index, show: false})
    new ChartJS(document.getElementById(`chart${index}`), config);
  };

  return (
    <div className="relative m-auto h-[40vh] w-[80vw] max-w-[600px]">
      <div className={`absolute left-[50%] top-[50%] ${showButton.show ? "" : 'hidden'}`}>
        <Button onClick={handle}>Mostrar Grafica</Button>
      </div>
      <canvas id={`chart${index}`}></canvas>
    </div>
  );
}
