import { TableColumn } from "src/@vex/interfaces/table-column.interface";

export const AportesConfigure: TableColumn<any>[] = [
  {
    label: "Identificación",
    property: "identificacion",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },
  {
    label: "Nombres",
    property: "nombre",
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
    label: "Aporte Personal",
    property: "aportePersonal",
    alternative:"aportes",
    type: "text",
    footerProperty:"totalPersonal",
    cssClasses: ["font-medium", "decimal"],
  },
  {
    label: "Aporte Adicional",
    property: "aporteAdicional",
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
