import Menu from "./app/Menu";
import TableProducion from "./app/TableProducion";
import PostProduccion from "./components/form/PostProduccion";
import ProduccionContextProvider from "./context/ProduccionContext";

function App() {
  return (
    <ProduccionContextProvider>
      <Menu />
      <TableProducion />
      <PostProduccion />
    </ProduccionContextProvider>
  );
}

export default App;
