import { TableColumn } from "src/@vex/interfaces/table-column.interface";

export const IngresosEgresosConfigure: TableColumn<any>[] = [
  {
    label: "Identificación",
    property: "identificacion",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "Nombres",
    property: "nombres",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "fecha",
    property: "fecha",
    type: "text",
    cssClasses: ["font-medium", "colortext", "fecha"],
  },
  {
    label: "Rubro",
    property: "rubro",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "Valor",
    property: "valor",
    alternative:"aportes",
    type: "text",
    footerProperty:"totalAdicional",
    cssClasses: ["font-medium", "decimal"],
  },
  {
    label: "Observaciones",
    property: "observaciones",
    type: "text",
    cssClasses: ["font-medium", "textArea"],
  },
];
