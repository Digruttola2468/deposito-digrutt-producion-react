import { Autocomplete, TextField } from "@mui/material";

export default function UpdateHistorialFallosMatrices() {
    return <>
        <main>
            <section className="flex flex-col md:flex-row">
                <form action="">
                    
                    <TextField placeholder="Descripcion Falla"/>
                    <TextField type="date" placeholder="fecha"/>
                    <TextField type="checkbox" placeholder="Esta Reparado?"/>
                    <TextField type="date" placeholder="Fecha que se reparo"/>
                </form>
            </section>
        </main>
    </>
}