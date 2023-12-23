import Menu from "./app/Menu";
import TableMaquinaParada from "./app/TableMaquinaParada";
import TableProducion from "./app/TableProducion";
import PostMaquinaParada from "./components/form/PostMaquinaParada";
import PostProduccion from "./components/form/PostProduccion";
import MaquinaParadaProvider from "./context/MaquinaParadaContext";
import ProduccionContextProvider from "./context/ProduccionContext";

import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route
          path="/"
          element={
            <ProduccionContextProvider>
              <TableProducion />
              <PostProduccion />
            </ProduccionContextProvider>
          }
        />
        <Route path="/maquinaParada" element={
          <MaquinaParadaProvider>
            <TableMaquinaParada />
            <PostMaquinaParada />
          </MaquinaParadaProvider>
        } />
      </Routes>
    </>
  );
}

export default App;
