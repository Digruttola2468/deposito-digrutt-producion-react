import { useContext, useState } from "react";
import logo from "../assets/digrutt_logo.png";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Menu() {
  const navegate = useNavigate();
  const [showMenuResponsive, setShowMenuResponsive] = useState(false);
  const { userSupabase } = useContext(UserContext);

  const [menuActive, setMenuActive] = useState({
    produccion: true,
    paradaMaquina: false,
    matrices: false,
    pedidos: false,
    remitos: false,
    notaEnvios: false,
  });

  const renderMenuProduccion = (role) => {
    return (
      <>
        <li>
          <a
            onClick={() => {
              setMenuActive({
                produccion: true,
                paradaMaquina: false,
                matrices: false,
                pedidos: false,
                remitos: false,
                notaEnvios: false,
              });
              navegate("/");
            }}
            className={`block py-2 px-3 rounded md:bg-transparent ${
              menuActive.produccion
                ? "text-white bg-blue-700 md:text-blue-700 cursor-default"
                : "text-gray-900 md:text-gray-900 cursor-pointer"
            } md:p-0 `}
          >
            Produccion
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setMenuActive({
                produccion: false,
                paradaMaquina: true,
                matrices: false,
                pedidos: false,
                remitos: false,
                notaEnvios: false,
              });
              navegate("/maquinaParada");
            }}
            className={`block py-2 px-3 rounded md:bg-transparent ${
              menuActive.paradaMaquina
                ? "text-white bg-blue-700 md:text-blue-700 cursor-default"
                : "text-gray-900 md:text-gray-900 cursor-pointer"
            } md:p-0 `}
          >
            Maquinas Paradas
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setMenuActive({
                produccion: false,
                paradaMaquina: false,
                matrices: true,
                pedidos: false,
                remitos: false,
                notaEnvios: false,
              });
              navegate("/matrices");
            }}
            className={`block py-2 px-3 rounded md:bg-transparent ${
              menuActive.matrices
                ? "text-white bg-blue-700 md:text-blue-700 cursor-default"
                : "text-gray-900 md:text-gray-900 cursor-pointer"
            } md:p-0 `}
          >
            Matrices
          </a>
        </li>
      </>
    );
  };

  const renderMenuOficina = (role) => {
    return (
      <>
        <li>
          <a
            onClick={() => {
              setMenuActive({
                produccion: false,
                paradaMaquina: false,
                matrices: false,
                pedidos: true,
                remitos: false,
                notaEnvios: false,
              });
              navegate("/pedidos");
            }}
            className={`block py-2 px-3 rounded md:bg-transparent ${
              menuActive.pedidos
                ? "text-white bg-blue-700 md:text-blue-700 cursor-default"
                : "text-gray-900 md:text-gray-900 cursor-pointer"
            } md:p-0 `}
          >
            Pedidos
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setMenuActive({
                produccion: false,
                paradaMaquina: false,
                matrices: false,
                pedidos: false,
                remitos: true,
                notaEnvios: false,
              });
              navegate("/remitos");
            }}
            className={`block py-2 px-3 rounded md:bg-transparent ${
              menuActive.remitos
                ? "text-white bg-blue-700 md:text-blue-700 cursor-default"
                : "text-gray-900 md:text-gray-900 cursor-pointer"
            } md:p-0 `}
          >
            Remitos
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setMenuActive({
                produccion: false,
                paradaMaquina: false,
                matrices: false,
                pedidos: false,
                remitos: false,
                notaEnvios: true,
              });
              navegate("/notaEnvios");
            }}
            className={`block py-2 px-3 rounded md:bg-transparent ${
              menuActive.notaEnvios
                ? "text-white bg-blue-700 md:text-blue-700 cursor-default"
                : "text-gray-900 md:text-gray-900 cursor-pointer"
            } md:p-0 `}
          >
            Nota Envios
          </a>
        </li>
      </>
    );
  };

  const returnMenu = () => {
    if (userSupabase.role == "admin") {
      return (
        <>
          {renderMenuProduccion()} {renderMenuOficina()}
        </>
      );
    } else if (userSupabase.role == "oficina") {
      return <>{renderMenuOficina()}</>;
    } else if (userSupabase.role == "produccion") {
      return <>{renderMenuProduccion()} </>;
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="relative max-w-screen-xl flex flex-wrap items-center justify-between mx-auto  ">
        <a className=" flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className=" h-[46px]" alt="Flowbite Logo" />
        </a>
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={() => setShowMenuResponsive(!showMenuResponsive)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            showMenuResponsive ? "" : "hidden"
          } w-full md:block md:w-auto `}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {returnMenu()}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export function MenuLogInAndRegister() {
  const navegate = useNavigate();
  const [showMenuResponsive, setShowMenuResponsive] = useState(false);

  const [menuActive, setMenuActive] = useState({
    logIn: true,
    register: false,
  });

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
      <div className="relative max-w-screen-xl flex flex-wrap items-center justify-between mx-auto  ">
        <a className=" flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className=" h-[46px]" alt="Flowbite Logo" />
        </a>
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={() => setShowMenuResponsive(!showMenuResponsive)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            showMenuResponsive ? "" : "hidden"
          } w-full md:block md:w-auto `}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                onClick={() => {
                  setMenuActive({ logIn: true, register: false });
                  navegate("/login");
                }}
                className={`block py-2 px-3 rounded md:bg-transparent ${
                  menuActive.logIn
                    ? "text-white bg-blue-700 md:text-blue-700 cursor-default"
                    : "text-gray-900 md:text-gray-900 cursor-pointer"
                } md:p-0 `}
              >
                Iniciar Sesion
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setMenuActive({ logIn: false, register: true });
                  navegate("/signUp");
                }}
                className={`block py-2 px-3 rounded md:bg-transparent ${
                  menuActive.register
                    ? "text-white bg-blue-700 md:text-blue-700 cursor-default"
                    : "text-gray-900 md:text-gray-900 cursor-pointer"
                } md:p-0 `}
              >
                Registrarse
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
