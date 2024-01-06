import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { UserContext } from "./context/UserContext";
import MaquinaParadaProvider from "./context/MaquinaParadaContext";
import ProduccionContextProvider from "./context/ProduccionContext";

import Menu, { MenuLogInAndRegister } from "./app/Menu";
import TableMaquinaParada from "./app/TableMaquinaParada";
import TableProducion from "./app/TableProducion";

import PostMaquinaParada from "./components/form/PostMaquinaParada";
import PostProduccion from "./components/form/PostProduccion";

import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import SendEmail from "./pages/SendEmail";
import WaitForVerificacion from "./pages/WaitVerfication";
import MatricesContextProvider from "./context/MatricesContext";
import TableMatrices from "./app/TableMatrices";
import GraficaProduccion from "./app/GraficaProduccion";
import PostHistorialFalloseMatrices from "./components/form/PostHistorialFallosMatrices";

function App() {
  const { userSupabase } = useContext(UserContext);

  const renderProduccion = () => {
    return (
      <ProduccionContextProvider>
        <section className="relative mt-2">
          <TableProducion />
          <PostProduccion />
          <GraficaProduccion />
        </section>
      </ProduccionContextProvider>
    );
  };

  const renderMaquinaParada = () => {
    return (
      <MaquinaParadaProvider>
        <section>
          <TableMaquinaParada />
        </section>
      </MaquinaParadaProvider>
    );
  };

  const renderMatriz = () => {
    return (
      <MatricesContextProvider>
        <section className="mt-2">
          <TableMatrices />
        </section>
      </MatricesContextProvider>
    );
  };

  const renderNotPermissos = () => {
    return <><h1>No tiene Permisos</h1></>;
  };

  function validarProduccion() {
    if (userSupabase != null) {
      if (userSupabase.is_admin) return renderProduccion();
      else if (userSupabase.is_produccion) return renderProduccion();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }
  function validarMaquinaParada() {
    if (userSupabase != null) {
      if (userSupabase.is_admin) return renderMaquinaParada();
      else if (userSupabase.is_produccion) return renderMaquinaParada();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarMatrices() {
    if (userSupabase != null) {
      if (userSupabase.is_admin) return renderMatriz();
      else if (userSupabase.is_matriceria) return renderMatriz();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarMenus() {
    if (userSupabase != null) {
      return <Menu />
    } else return <MenuLogInAndRegister />;
  }

  return (
    <>
      <header className="">
        {validarMenus()}
      </header>
      <main>
        <Routes>
          <Route path="/" element={validarProduccion()} />
          <Route path="/maquinaParada" element={validarMaquinaParada()} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/sendGmail" element={<SendEmail />} />
          <Route path="/notVerificed" element={<WaitForVerificacion />} />
          <Route path="/matrices" element={validarMatrices()} />
        </Routes>
      </main>
    </>
  );
}

export default App;
