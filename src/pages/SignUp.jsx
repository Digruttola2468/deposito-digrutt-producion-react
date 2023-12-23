import { useContext, useState } from "react";

import TextField from "@mui/material/TextField";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Backdrop, CircularProgress } from "@mui/material";

export default function SignUp() {
  const { signUp, isDone } = useContext(UserContext);

  const navegate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const handleClick_signUp = () => {
    //verificamos los campos vacios
    if (
      email != "" &&
      password != "" &&
      confirmPassword != "" &&
      nombre != "" &&
      apellido != ""
    ) {
      //Verificamos el email
      const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

      if (password === confirmPassword) {
        if (email.match(pattern)) {
          //Obtenemos los datos
          signUp(nombre, apellido, email, password);
        } //else toast.error('El gmail es incorrecto')
      } //else toast.error("Las contraseñas no son iguales");
    } // else toast.error("Completar los campos");
  };

  const handleClick_iniciarSesion = () => navegate("/logIn");

  return (
    <div className="w-full flex items-center justify-center h-screen bg-slate-200">
      <div className="bg-white px-10 py-20 rounded-3xl border-2 w-[400px]">
        <h1 className="text-4xl font-semibold text-center">DIGRUTT S.R.L</h1>
        <div className="mt-8">
          <div className="flex flex-row justify-between items-center gap-x-3">
            <TextField
              label="Nombre"
              value={nombre}
              type="text"
              onChange={(evt) => setNombre(evt.target.value)}
              variant="outlined"
            />
            <TextField
              label="Apellido"
              value={apellido}
              type="text"
              onChange={(evt) => setApellido(evt.target.value)}
              variant="outlined"
            />
          </div>
          <div className="flex flex-col mt-4">
            <TextField
              label="Gmail"
              value={email}
              type="email"
              onChange={(evt) => setEmail(evt.target.value)}
              variant="outlined"
            />
          </div>
          <div className="flex flex-row mt-4 gap-x-3">
            <TextField
              label="Password"
              value={password}
              type="password"
              onChange={(evt) => setPassword(evt.target.value)}
              variant="outlined"
            />
            <TextField
              label="Repeat password"
              value={confirmPassword}
              type="password"
              onChange={(evt) => setConfirmPassword(evt.target.value)}
              variant="outlined"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            className="w-full active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
            onClick={handleClick_signUp}
          >
            Registrarse
          </button>
        </div>
        <div className="mt-8 flex justify-center items-center">
          <p className="font-medium text-base">Estas registrado?</p>
          <button
            className="text-violet-500 text-base font-medium ml-2 hover:text-violet-400"
            onClick={handleClick_iniciarSesion}
          >
            Iniciar Sesion
          </button>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isDone}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
