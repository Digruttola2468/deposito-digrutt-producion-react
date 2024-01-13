import { Document, Page, Text } from "@react-pdf/renderer";

export default function RemitoA4PDF({
  fecha = "",
  cliente = "",
  domicilio = "",
  CUIT = "",
  nroOrden = "",
  products = [],
  totalDeclarado = 0,
}) {

  const formatDate = (fecha) => {
    if(fecha != "") {
      const date = new Date(fecha);
      const año = date.getFullYear().toString().slice(2,4);
      const dia = date.getDate() + 1;
      const mes = date.getMonth() + 1;
  
      return ` ${dia}   ${mes}   ${año}`;
    }else return ` ${0}   ${0}   ${2023}`;
    
  };

  return (
    <>
      <Document>
        <Page size={"A4"}>
          <div>
            <Text style={{ paddingLeft: 470, color: "black", paddingTop: 100 }}>
              {formatDate(fecha)}
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: 40,
              marginLeft: 70
            }}
          >
            <div>
              <Text style={{ fontSize: "11px" }}>Señor/es: {cliente}</Text>
              <Text style={{ fontSize: "11px" }}>Domicilio: {domicilio}</Text>
              <Text style={{ fontSize: "11px" }}>I.V.A: R.I</Text>
            </div>
            <div>
              <Text style={{ fontSize: "11px" }}>C.U.I.T N: {CUIT}</Text>
              <Text style={{ fontSize: "11px" }}>
                Condicion de cobro: 30 DIAS FECHA FACTURA
              </Text>
              <Text style={{ fontSize: "11px" }}>Nro. Orden: {nroOrden}</Text>
            </div>
          </div>

          <div style={{ marginTop: 90, marginLeft: 70, marginRight: 30, position: 'relative' }}>
            <table>
              <thead style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <th>
                  <Text>Cantidad</Text>
                </th>
                <th>
                  <Text>Descripcion</Text>
                </th>
              </thead>
              <tbody >
                {products.length > 0 ? (
                  products.map((elem) => (
                    <tr
                      key={elem.id}
                      style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}
                    >
                      <td>
                        <Text style={{ fontSize: "14px" }}>{elem.stock}</Text>
                      </td>
                      <td>
                        <Text style={{ fontSize: "14px" }}>
                          {elem.descripcion}
                        </Text>
                      </td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
                <tr></tr>
              </tbody>
            </table>
            <div style={{position: 'absolute', top: 450, left: 250}}>
              <Text>Valor Declarado: AR${totalDeclarado}</Text>
            </div>
          </div>
        </Page>
      </Document>
    </>
  );
}
