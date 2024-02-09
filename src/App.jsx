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
import TableOficina from "./components/tables/TableOficina";
import TableInventarioNombres from "./components/tables/TableInventarioNombres";
import TableNotaEnvios from "./components/tables/TableNotaEnvios";
import TableMercaderia from "./components/tables/TableMercaderia";
import TableInventario from "./components/tables/TableInventario";
import TableClientes from "./components/tables/TableClientes";
import Home from "./pages/Home";
import EnviosContextProvider from "./context/EnviosContext";
import TableEnvios from "./components/tables/TableEnvios";
import InventarioContextProvider from "./context/InventarioContext";
import MercaderiaProvider from "./context/MercaderiaContext";

function App() {
  const { userSupabase } = useContext(UserContext);

  const role = userSupabase?.role ?? null;

  const renderEnvios = () => {
    return (
      <EnviosContextProvider>
        <TableEnvios />
      </EnviosContextProvider>
    );
  };

  const renderProduccion = () => {
    return (
      <ProduccionContextProvider>
        <section className="relative mt-2">
          <TableProducion />
          <TableInventarioNombres type={"produccion"} />
          
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
          <TableInventarioNombres type={"pedidos"} />
        </section>
      </PedidosProvider>
    );
  };

  const renderRemito = () => {
    return (
      <>
        <section>
          <TableOficina />
        </section>
        <section className="mt-8">
          <TableInventarioNombres type={"remito"} />
        </section>
      </>
    );
  };

  const renderNotaEnvio = () => {
    return (
      <>
        <section>
          <TableNotaEnvios />
        </section>
        <section className="mt-8">
          <TableInventarioNombres type={"notaEnvio"} />
        </section>
      </>
    );
  };

  const renderMercaderia = () => {
    return (
      <>
        <MercaderiaProvider>
          <TableMercaderia />
        </MercaderiaProvider>
      </>
    );
  };

  const renderInventario = () => {
    return (
      <>
        <InventarioContextProvider>
          <TableInventario />
        </InventarioContextProvider>
        <ClientesProvider>
          <TableClientes />
        </ClientesProvider>
      </>
    );
  };

  const renderNotPermissos = () => {
    return (
      <>
        <h1>No tiene Permisos</h1>
      </>
    );
  };

  function validarEnvios() {
    if (userSupabase != null) {
      if (role === "admin" || role == "envios") return renderEnvios();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarProduccion() {
    if (userSupabase != null) {
      if (role === "admin" || role == "produccion") return renderProduccion();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }
  function validarMaquinaParada() {
    if (userSupabase != null) {
      if (role === "admin" || role == "produccion")
        return renderMaquinaParada();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarMatrices() {
    if (userSupabase != null) {
      if (role === "admin" || role == "matriceria" || role == "produccion")
        return renderMatriz();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarPedidos() {
    if (userSupabase != null) {
      if (role === "admin" || role == "mercaderia" || role == "oficina")
        return renderPedidos();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarRemito() {
    if (userSupabase != null) {
      if (role === "admin" || role == "oficina") return renderRemito();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarNotaEnvio() {
    if (userSupabase != null) {
      if (role === "admin" || role == "oficina") return renderNotaEnvio();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarMercaderia() {
    if (userSupabase != null) {
      if (role === "admin" || role == "mercaderia") return renderMercaderia();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarInventario() {
    if (userSupabase != null) {
      if (role !== "user") return renderInventario();
      else return renderNotPermissos();
    } else return renderNotPermissos();
  }

  function validarMenus() {
    if (userSupabase != null) return <Menu />;
    else return <MenuLogInAndRegister />;
  }

  return (
    <>
      <header className="">{validarMenus()}</header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produccion" element={validarProduccion()} />
          <Route path="/envios" element={validarEnvios()} />
          <Route path="/maquinaParada" element={validarMaquinaParada()} />
          <Route path="/matrices" element={validarMatrices()} />
          <Route path="/pedidos" element={validarPedidos()} />
          <Route path="/remitos" element={validarRemito()} />
          <Route path="/notaEnvios" element={validarNotaEnvio()} />
          <Route path="/mercaderia" element={validarMercaderia()} />
          <Route path="/inventario" element={validarInventario()} />
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
