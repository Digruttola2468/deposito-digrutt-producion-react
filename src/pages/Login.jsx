import { TextField } from "@mui/material";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { FcGoogle } from "react-icons/fc";

import progress from "../assets/progress_activity.svg";

export default function LogIn() {
  const { signInWithGoogle, logIn, loading } = useContext(UserContext);

  const navegate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClick_signIn = () => {
    //verificamos los campos vacios
    if (email != "" && password != "") {
      //Verificamos el email
      const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

      if (email.match(pattern)) {
        logIn(email, password);
      }
    }
  };

  const handleClick_signInWithGoogle = async () => {
    signInWithGoogle();
  };

  const handleClick_registrarse = () => navegate("/signUp");

  return (
      <h1>Hola soy una session</h1>
  );
}

/**<div className="w-full flex items-center justify-center h-screen bg-slate-200">
      <div className="bg-white px-10 py-20 rounded-3xl border-2 ">
        <h1 className="text-4xl font-semibold text-center">DIGRUTT S.R.L</h1>
        <div className="mt-8">
          <div className="w-full my-4">
            <TextField
              label="Gmail"
              value={email}
              type="email"
              onChange={(evt) => setEmail(evt.target.value)}
              variant="outlined"
              sx={{ width: "100%" }}
            />
          </div>
          <div className="w-full mt-4 relative">
            <TextField
              label="Password"
              value={password}
              type={showPassword ? "text" : "password"}
              onChange={(evt) => setPassword(evt.target.value)}
              variant="outlined"
              sx={{ width: "100%" }}
            />
            <span
              className="top-[18px] right-3 absolute hover:cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <BsEye size={"20px"} />
              ) : (
                <BsEyeSlash size={"20px"} />
              )}
            </span>
          </div>
          <div className="mt-8 flex flex-col gap-y-4">
            <button
              className="flex justify-center items-center active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
              onClick={handleClick_signIn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <img
                    src={progress}
                    className="text-white animate-spin h-5 w-5 mr-3"
                  />
                </>
              ) : (
                <></>
              )}
              {loading ? "Iniciando..." : "Iniciar Sesion"}
            </button>
            <button
              className="flex py-3 rounded-lg border-2 border-gray-200 items-center justify-center gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out"
              onClick={handleClick_signInWithGoogle}
            >
              <FcGoogle />
              Iniciar Sesion Con Google
            </button>
          </div>
          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">No tenes una cuenta?</p>
            <button
              className="text-violet-500 text-base font-medium ml-2 hover:text-violet-400"
              onClick={handleClick_registrarse}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div> */