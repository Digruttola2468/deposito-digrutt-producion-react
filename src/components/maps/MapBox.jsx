import { useRef, useEffect, useState, useContext } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import BoxVehiculos from "../comboBox/BoxVehiculos";
import { Divider, TextField } from "@mui/material";
import BoxLugaresVisitados from "../comboBox/BoxLugaresVisitados";
import axios from "axios";
import { EnviosContext } from "../../context/EnviosContext";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";

const listLocalidad = [
  {
    id: 1,
    ciudad: "Rosario",
  },
  {
    id: 2,
    ciudad: "Fighiera",
  },
  {
    id: 3,
    ciudad: "Alvear",
  },
  {
    id: 4,
    ciudad: "Fuentes",
  },
  {
    id: 5,
    ciudad: "Villa Diego",
  },
  {
    id: 6,
    ciudad: "Funes",
  },
  {
    id: 7,
    ciudad: "Roldan",
  },
  {
    id: 8,
    ciudad: "Pueblo Esther",
  },
];

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

mapboxgl.accessToken = MAPBOX_TOKEN;

export default function MapBox() {
  const { userSupabase, BASE_URL } = useContext(UserContext);
  const { postTable } = useContext(EnviosContext);
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(-60.6275);
  const [lat, setLat] = useState(-33.01597);
  const [zoom, setZoom] = useState(15);

  const [vehiculo, setVehiculo] = useState("2");
  const [descripcion, setDescripcion] = useState("");
  const [fechaDate, setFechaDate] = useState("");
  const [lugarVisitado, setLugarVisitado] = useState("");

  const [altura, setAltura] = useState("");

  const marker = new mapboxgl.Marker();

  const empty = () => {
    setVehiculo("2");
    setFechaDate("");
    setLugarVisitado("");
    setDescripcion("");
    setAltura("");
    setZoom(15);
    setLat(-33.0183);
    setLng(-60.628);
  };

  useEffect(() => {
    if (lugarVisitado != null && lugarVisitado != "") {
      const { lat, lon } = lugarVisitado;
      setLat(lat);
      setLng(lon);
      marker.setLngLat([lon, lat]);
    }
  }, [lugarVisitado]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add geolocate control to the map.
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );

    //new mapboxgl.Marker().setLngLat([-60.6275, -33.01597]).addTo(map.current);

    marker.setLngLat([lng, lat]).addTo(map.current);

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("click", (event) => {
      const lat = event.lngLat.lat;
      const long = event.lngLat.lng;
      setLat(lat);
      setLng(long);
      marker.setLngLat([long, lat]);
    });
  });

  const send = (obj) => {
    toast.promise(
      axios
        .post(`${BASE_URL}/envios`, obj, {
          headers: {
            Authorization: `Bearer ${userSupabase.token}`,
          },
        })
        .then((result) => {
          postTable(result);

          empty();
        }),
      {
        loading: "Creando Cliente...",
        success: "Operacion exitosa",
        error: (err) => {
          console.log(err.response.data.campus);
          setRequestError({ campus: err.response.data.campus });
          return err.response.data?.message ?? "Something Wrong";
        },
      }
    );
  };

  const handleClickLongLat = () => {
    let enviar = {
      idVehiculo: vehiculo,
      ubicacion: null,
      descripcion: descripcion,
      fechaDate: fechaDate,
      idLocalidad: null,
      lat: null,
      lon: null,
    };

    if (enviar.fechaDate == null || enviar.fechaDate == "") {
      const dateNow = new Date();

      const mes = dateNow.getMonth() + 1;
      const dia = dateNow.getDate();
      const minutos = dateNow.getMinutes();
      const hora = dateNow.getHours();

      const fechaYhora = `${dateNow.getFullYear()}-${
        mes < 10 ? `0${mes}` : mes
      }-${dia < 10 ? `0${dia}` : dia}T${hora < 10 ? `0${hora}` : hora}:${
        minutos < 10 ? `0${minutos}` : minutos
      }`;

      enviar.fechaDate = fechaYhora;
    }

    if (lugarVisitado != "") {
      enviar.lat = lugarVisitado.lat;
      enviar.lon = lugarVisitado.lon;
      enviar.idLocalidad = lugarVisitado.idLocalidad;
      enviar.ubicacion = lugarVisitado.ubicacion;

      send(enviar);
    } else {
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
        )
        .then((result) => {
          enviar.lat = lat;
          enviar.lon = lng;
          enviar.ubicacion = `${result.data.features[0].text} ${altura}`;

          const ciudad = result.data.features[2].text;
          const findCity = listLocalidad.find((elem) => elem.ciudad == ciudad);

          enviar.idLocalidad = findCity.id;

          send(enviar);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <section>
      <Divider>
        <h1 className="text-center my-2 font-bold uppercase text-lg">
          Nuevo Envio
        </h1>
      </Divider>
      <div className="p-4 flex flex-col items-center justify-center ">
        <BoxLugaresVisitados
          lugarVisitado={lugarVisitado}
          setLugarVisitado={(evt) => {
            const lugar = evt.target.value;
            setLugarVisitado(lugar);

            setLng(lugar.lon);
            setLat(lugar.lat);

            setAltura("");
          }}
        />
      </div>
      <div>
        <div ref={mapContainer} className="h-[400px] max-w-[900px] m-auto" />
      </div>

      <div className="p-4 flex flex-col gap-4 items-center justify-center ">
        <BoxVehiculos vehiculo={vehiculo} setVehiculo={setVehiculo} />
        <TextField
          label="Altura Calle"
          type="number"
          value={altura}
          onChange={(evt) => setAltura(evt.target.value)}
          disabled={lugarVisitado != "" ? true : false}
        />
        <TextField
          label="Descripcion"
          value={descripcion}
          onChange={(evt) => setDescripcion(evt.target.value)}
        />
        <TextField
          value={fechaDate}
          onChange={(event) => setFechaDate(event.target.value)}
          type="datetime-local"
        />
        <button
          onClick={handleClickLongLat}
          className="max-w-[300px] text-center mt-3 px-6 py-3 rounded-lg bg-blue-500 text-white border-2 border-gray-200 gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
        >
          Enviar Ubicacion
        </button>
      </div>
    </section>
  );
}
