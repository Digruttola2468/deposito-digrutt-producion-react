import { Document, Page, Text } from "@react-pdf/renderer";

export default function RemitoA5PDF({
  fecha,
  cliente,
  domicilio = "",
  CUIT = "",
  localidad = "",
  products,
  totalDeclarado = 0,
}) {
  const formatDate = (fecha) => {
    if (fecha != "") {
      const date = new Date(fecha);
      const año = date.getFullYear().toString().slice(2, 4);
      const dia = date.getDate() + 1;
      const mes = date.getMonth() + 1;

      const enviar = ` ${dia}   ${mes}   ${año}`;
      console.log(enviar);

      return ` ${dia}   ${mes}   ${año}`;
    } else return ` ${0}   ${0}   ${2023}`;
  };

  return (
    <>
      <Document>
        <Page size={"A5"}>
          <div>
            <Text style={{ paddingLeft: 300, color: "black", paddingTop: 40 }}>
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
              marginLeft: 70,
            }}
          >
            <div>
              <Text style={{ fontSize: "11px" }}>{cliente}</Text>
            </div>
            <div className="flex flex-row">
              <Text style={{ fontSize: "11px" }}>{domicilio}</Text>
              <Text style={{ fontSize: "11px" }}>{localidad}</Text>
            </div>
            <div className="flex flex-row">
              <Text style={{ fontSize: "11px" }}>R.I</Text>
              <Text style={{ fontSize: "11px" }}>{CUIT}</Text>
            </div>
          </div>

          <div
            style={{
              marginTop: 90,
              marginLeft: 70,
              marginRight: 30,
              position: "relative",
            }}
          >
            {products.length > 0 ? (
              products.map((elem) => (
                <div
                  key={elem.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Text style={{ fontSize: "14px" }}>{elem.stock}</Text>
                  </div>
                  <div>
                    <Text style={{ fontSize: "14px" }}>{elem.descripcion}</Text>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
            <div style={{ position: "absolute", top: 450, left: 250 }}>
              <Text>AR${totalDeclarado}</Text>
            </div>
          </div>
        </Page>
      </Document>
    </>
  );
}
