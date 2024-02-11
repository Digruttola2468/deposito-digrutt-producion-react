import { useContext } from "react"
import { UserContext } from "../context/UserContext"

export default function Home() {
    const {signOut} = useContext(UserContext);

    
    return <section>
        <button onClick={signOut}>Log Out</button>
    </section>
}