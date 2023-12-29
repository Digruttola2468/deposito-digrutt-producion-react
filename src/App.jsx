import { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { UserContext } from "./context/UserContext";
import MaquinaParadaProvider from "./context/MaquinaParadaContext";
import ProduccionContextProvider from "./context/ProduccionContext";

import Menu from "./app/Menu";
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

function App() {
  const { userSupabase } = useContext(UserContext);

  const renderProduccion = () => {
    return (
      <ProduccionContextProvider>
        <section className="relative">
          <TableProducion />
          <PostProduccion />
        </section>
      </ProduccionContextProvider>
    );
  };

  const renderMaquinaParada = () => {
    return (
      <MaquinaParadaProvider>
        <section>
          <TableMaquinaParada />
          <PostMaquinaParada />
        </section>
      </MaquinaParadaProvider>
    );
  };

  const renderMatriz = () => {
    return (
      <MatricesContextProvider>
        <section>
          <TableMatrices />
        </section>
      </MatricesContextProvider>
    );
  };

  const renderNotPermissos = () => {
    return <></>;
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

  return (
    <>
      <header className="">
        <Menu />
      </header>
      <main>
        <Routes>
          <Route path="/" element={validarProduccion()} />
          <Route path="/maquinaParada" element={validarMaquinaParada()} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/sendGmail" element={<SendEmail />} />
          <Route path="/notVerificed" element={<WaitForVerificacion />} />
          <Route path="/matrices" element={renderMatriz()} />
        </Routes>
      </main>
    </>
  );
}

export default App;
