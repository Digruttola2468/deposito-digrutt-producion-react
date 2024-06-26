import { useState, createContext, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const BASE_URL =
    "https://deposito-digrutt-express-production.up.railway.app/api";

  const navegate = useNavigate();
  const [userSupabase, setUserSupabase] = useLocalStorage("user", null);

  const [isDone, setIsDone] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userSupabase != null) navegate("/");
    else navegate("/login");
  }, []);

  const signOut = () => {
    setUserSupabase(null);
  };

  const logIn = (email, password) => {
    toast.promise(
      axios
        .post(`${BASE_URL}/session/login`, {
          email,
          password,
        })
        .then((result) => {
          setUserSupabase({token: result.data.token, ...result.data.user});
          navegate("/");
        }),
      {
        loading: "Cargando...",
        error: (err) => err.response?.data.message ?? "No se logro iniciar session",
      }
    );
  };

  const signUp = (nombre, apellido, email, password) => {
    toast.promise(
      axios
        .post(`${BASE_URL}/session/register`, {
          first_name: nombre,
          last_name: apellido,
          password: password,
          email: email,
        })
        .then((result) => {
          navegate("/sendGmail");
        }),
      {
        loading: "Cargando...",
        success: "Registrado con exito, Verifica el Gmail",
        error: "Ocurrio un Error",
      }
    );
  };

  const signInWithGoogle = async () => {
    //Enviar a la pagina del backend para iniciar sesion con google
    toast.error("No esta Habilitado");
  };

  return (
    <UserContext.Provider
      value={{
        signInWithGoogle,
        signOut,
        logIn,
        signUp,
        userSupabase,
        isDone,
        loading,
        BASE_URL,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
