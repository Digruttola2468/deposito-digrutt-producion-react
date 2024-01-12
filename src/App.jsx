import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { UserContext } from "./context/UserContext";
import MaquinaParadaProvider from "./context/MaquinaParadaContext";
import ProduccionContextProvider from "./context/ProduccionContext";

import Menu, { MenuLogInAndRegister } from "./app/Menu";
import TableMaquinaParada from "./app/TableMaquinaParada";
import TableProducion from "./app/TableProducion";

import PostProduccion from "./components/form/PostProduccion";

import SignUp from "./pages/SignUp";
import IniciarSesion from "./pages/Iniciar";
import SendEmail from "./pages/SendEmail";
import WaitForVerificacion from "./pages/WaitVerfication";
import MatricesContextProvider from "./context/MatricesContext";
import TableMatrices from "./app/TableMatrices";
import GraficaProduccion from "./app/GraficaProduccion";
import PedidosProvider from "./context/PedidosContext";
import TablePedidos from "./components/tables/TablePedidos";
import TableHistorialErrorMatrices from "./components/tables/TableHistorialErrorMatrices";
import UpdateHistorialFallosMatrices from "./components/form/UpdateHistorialFallosMatrices";

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
          <TableHistorialErrorMatrices />
        </section>
      </MatricesContextProvider>
    );
  };

  const renderPedidos = () => {
    return (
      <PedidosProvider>
        <section className="mt-2">
          <TablePedidos />
        </section>
      </PedidosProvider>
    );
  };

  const renderNotPermissos = () => {
    return (
      <>
        <h1>No tiene Permisos</h1>
      </>
    );
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
  function validarPedidos() {
    if (userSupabase != null) {
      if (userSupabase.is_admin) return renderPedidos();
      else if (userSupabase.is_mercaderia) return renderPedidos();
      else if (userSupabase.is_oficina) return renderPedidos();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarMenus() {
    if (userSupabase != null) {
      return <Menu />;
    } else return <MenuLogInAndRegister />;
  }

  return (
    <>
      <header className="">{validarMenus()}</header>
      <main>
        <Routes>
          <Route path="/" element={validarProduccion()} />
          <Route path="/maquinaParada" element={validarMaquinaParada()} />
          <Route path="/matrices/*" element={validarMatrices()} />
          <Route path="/pedidos" element={validarPedidos()} />
          <Route path="/login" element={<IniciarSesion />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/sendGmail" element={<SendEmail />} />
          <Route path="/notVerificed" element={<WaitForVerificacion />} />
          
        </Routes>
      </main>
    </>
  );
}

export default App;
