import { useNavigate } from "react-router-dom";

export default function WaitForVerificacion() {
  const navegate = useNavigate();

  return (
    <div>
      <h1>
        LISTO YA ESTAS REGISTRADO , FALTA QUE EL DUEÑO DE LA PAGINA TE VERIFIQUE
        PARA PODER ACCEDER
      </h1>
      <button
        onClick={() => {
          navegate("/logIn");
        }}
      >
        Iniciar Sesion{" "}
      </button>
    </div>
  );
}
