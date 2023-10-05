import { TableColumn } from "src/@vex/interfaces/table-column.interface";

export const RolesConfigure: TableColumn<any>[] = [
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
    label: "Ingresos",
    property: "ingresos",
    type: "text",
    cssClasses: ["font-medium", "decimal"],
  },
  {
    label: "Descuentos",
    property: "descuentos",
    type: "text",
    cssClasses: ["font-medium", "decimal"],
  },
  {
    label: "Liquido",
    property: "liquido",
    type: "text",
    cssClasses: ["font-medium", "decimal"],
  },
];
