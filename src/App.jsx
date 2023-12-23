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

  console.log(userSupabase);
  /**{
    "created_at": "2023-11-26T00:09:54.737732+00:00",
    "nombre": null,
    "apellido": null,
    "is_admin": true,
    "is_mercaderia": false,
    "is_oficina": false,
    "is_produccion": false,
    "is_matriceria": false,
    "gmail": "ivandigruttola7@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkX2F0IjoiMjAyMy0xMS0yNlQwMDowOTo1NC43Mzc3MzIrMDA6MDAiLCJub21icmUiOm51bGwsImFwZWxsaWRvIjpudWxsLCJpc19hZG1pbiI6dHJ1ZSwiaXNfbWVyY2FkZXJpYSI6ZmFsc2UsImlzX29maWNpbmEiOmZhbHNlLCJpc19wcm9kdWNjaW9uIjpmYWxzZSwiaXNfbWF0cmljZXJpYSI6ZmFsc2UsImdtYWlsIjoiaXZhbmRpZ3J1dHRvbGE3QGdtYWlsLmNvbSIsImlhdCI6MTcwMzM1NjAzMX0.lkRzsIeCjbtpAgFUJyq2ULxl6r_v9GpnXL7YbMno-r8"
} */
  function validarProduccion() {
    if (userSupabase != null) {
      if (userSupabase.is_admin) {
        return (
          <ProduccionContextProvider>
            <Menu />
            <TableProducion />
            <PostProduccion />
          </ProduccionContextProvider>
        );
      } else if (userSupabase.is_produccion) {
        return (
          <ProduccionContextProvider>
            <Menu />
            <TableProducion />
            <PostProduccion />
          </ProduccionContextProvider>
        );
      } else return <></>;
    } else return <></>;
  }
  function validarMaquinaParada() {
    if (userSupabase != null) {
      if (userSupabase.is_admin) {
        return (
          <MaquinaParadaProvider>
            <Menu />
            <TableMaquinaParada />
            <PostMaquinaParada />
          </MaquinaParadaProvider>
        );
      } else if (userSupabase.is_produccion) {
        return (
          <MaquinaParadaProvider>
            <Menu />
            <TableMaquinaParada />
            <PostMaquinaParada />
          </MaquinaParadaProvider>
        );
      } else return <></>;
    } else return <></>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={validarProduccion()} />
        <Route path="/maquinaParada" element={validarMaquinaParada()} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/sendGmail" element={<SendEmail />} />
        <Route path="/notVerificed" element={<WaitForVerificacion />} />
      </Routes>
    </>
  );
}

export default App;
