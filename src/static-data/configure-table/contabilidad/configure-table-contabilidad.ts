import { TableColumn } from "src/@vex/interfaces/table-column.interface";

export const AsientoConfigure: TableColumn<any>[] =  [
  {
    label: 'N° Serie',
    property: 'numeroSerie',
    type: 'text',
    cssClasses: ['font-medium',"texto",]
  },
    {
      label: 'N° Comprobante',
      property: 'idAsientoContable',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
    {
      label: 'N° Control',
      property: 'numeroControl',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
    {
      label: 'fecha',
      property: 'fecha',
      type: 'text',
      cssClasses: ['font-medium','colortext','fecha']
    },
    {
      label: 'Observaciones',
      property: 'observaciones',
      type: 'text',
      cssClasses: ['font-medium','colortext',"texto-No-Capital",'mat-column-width-30','mat-column-max-width-250px']
    },
    {
      label: 'acciones',
      property: 'acciones',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];

