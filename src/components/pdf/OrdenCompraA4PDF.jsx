import { Document, Page, Text, View } from "@react-pdf/renderer";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const formatDate = (date) => {
  const fecha = new Date(date);
  const dia = fecha.getDate() + 1;
  const mes = fecha.getMonth() + 1;

  const listMeses = [
    "",
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  return ` ${dia} ${listMeses[mes]}`;
};

export const generarPDF = (list = []) => {
  const doc = new jsPDF();
  
  if (list.length != 0) {
    const columns = [
      "descripcion",
      "Cantidad pedida",
      "Cantidad Enviada",
      "Fecha Entrega",
    ];

    let data = [];

    for (let i = 0; i < list.length; i++) {
      const element = list[i];

      data.push([
        element.descripcion,
        element.cantidadEnviar,
        element?.cantidad_enviada ?? "0",
        formatDate(element.fecha_entrega),
      ]);
    }

    doc.autoTable({
      startY: 30,
      head: [columns],
      body: data,
    });

    doc.save(`OrdenCompra.pdf`);
  }
};

export default function OrdenCompraA4PDF({ list = [] }) {

  if (list.length == 0)
    return (
      <>
        <Document>
          <Page
            size="A4"
            style={{
              display: "flex",
              fontSize: 11,
              flexDirection: "column",
            }}
          ></Page>
        </Document>
      </>
    );

  return (
    <>
      <Document>
        <Page
          size="A4"
          style={{
            display: "flex",
            fontSize: 11,
            flexDirection: "column",
          }}
        >
          <div>
            <Text>Orden Compra: {list[0].ordenCompra}</Text>
          </div>
          <table>
            <thead
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <th style={{ textAlign: "center" }}>
                <Text>Descripcion</Text>
              </th>
              <th style={{ color: "red", textAlign: "center" }}>
                <Text>Cantidad Pedida</Text>
              </th>
              <th style={{ color: "green", textAlign: "center" }}>
                <Text>Cantidad Enviada</Text>
              </th>
              <th>
                <Text>Fecha Entrega</Text>
              </th>
            </thead>
            <tbody>
              {list.map((elem) => (
                <tr
                  key={elem.id}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <td style={{ textAlign: "center" }}>
                    <Text style={{ fontSize: "9px" }}>
                      {elem.descripcion.slice(0, 40)}
                    </Text>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Text style={{ color: "red", fontSize: "11px" }}>
                      {elem.cantidadEnviar}
                    </Text>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Text style={{ color: "green", fontSize: "11px" }}>
                      {elem?.cantidad_enviada ?? "0"}
                    </Text>
                  </td>
                  <td>
                    <Text style={{ fontSize: "11px" }}>
                      {formatDate(elem.fecha_entrega)}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Page>
      </Document>
    </>
  );
}
