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

function App() {
  const { userSupabase } = useContext(UserContext);

  const renderProduccion = () => {
    return (
      <section>
        <ProduccionContextProvider>
          <TableProducion />
          <PostProduccion />
        </ProduccionContextProvider>
      </section>
    );
  };

  const renderMaquinaParada = () => {
    return (
      <section>
        <MaquinaParadaProvider>
          <TableMaquinaParada />
          <PostMaquinaParada />
        </MaquinaParadaProvider>
      </section>
    );
  };

  function validarProduccion() {
    if (userSupabase != null) {
      if (userSupabase.is_admin) {
        return renderProduccion();
      } else if (userSupabase.is_produccion) {
        return renderProduccion();
      } else return <></>;
    } else return <></>;
  }
  function validarMaquinaParada() {
    if (userSupabase != null) {
      if (userSupabase.is_admin) {
        return renderMaquinaParada();
      } else if (userSupabase.is_produccion) {
        return renderMaquinaParada();
      } else return <></>;
    } else return <></>;
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
        </Routes>
      </main>
    </>
  );
}

export default App;
