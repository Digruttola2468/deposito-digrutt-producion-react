import { useState, createContext, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { db_supabase } from "../supabase/config";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navegate = useNavigate();
  const [userSupabase, setUserSupabase] = useLocalStorage("user", null);

  const [isDone, setIsDone] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //Validar el usuario guardado en el local storage
    if (userSupabase) {
      console.log("user", userSupabase);
    } else navegate("/login");
  }, []);

  const signOut = async () => {
    try {
      const { error } = await db_supabase.auth.signOut();
      if (error) throw new Error("Error al momento de cerrar sesion");
      setUserSupabase(null);
    } catch (error) {
      console.error(error);
    }
  };

  const logIn = (email, password) => {
    toast.promise(
      axios
        .get(`${BASE_URL}/login?email=${email}&password=${password}`)
        .then((result) => {
          setUserSupabase(result.data);
          toast.success(
            `Bienvendio ${result.data.nombre} ${result.data.apellido}`
          );
          navegate("/");
        }),
      {
        loading: "Cargando...",
        error: (err) => err.response.data.message,
      }
    );
  };

  const signUp = (nombre, apellido, email, password) => {
    toast.promise(
      axios
        .post(`${BASE_URL}/register`, {
          nombre: nombre,
          apellido: apellido,
          password: password,
          gmail: email,
        })
        .then((result) => {
          navegate("/sendGmail");
        }),
      {
        loading: "Cargando...",
        success: (data) => {
          console.log("Register: ", data);
          return "Registrado con exito, Verifica el Gmail";
        },
        error: (err) => {
          console.log("Register: ", err.response.data.menssage);
          return "Ocurrio un Error";
        },
      }
    );
  };

  const signInWithGoogle = async () => {
    //Enviar a la pagina del backend para iniciar sesion con google
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
