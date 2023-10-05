import { TableColumn } from "src/@vex/interfaces/table-column.interface";

export const EmisoresConfigure: TableColumn<any>[] =  [
    {
      label: 'Identificación',
      property: 'identificacion',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
  {
      label: 'Razón Social',
      property: 'razonSocial',
      type: 'text',
      cssClasses: ['font-medium',"texto",'mat-column-width-30','mat-column-max-width-250px']
    },
      {
      label: 'Calificación',
      property: 'calificacion',
      type: 'text',
      cssClasses: ['font-medium','colortext',"texto-No-Capital"]
    },
    {
      label: 'Correo',
      property: 'correo1',
      type: 'text',
      cssClasses: ['font-medium','colortext',"texto-No-Capital"]
    },
    {
      label: 'acciones',
      property: 'acciones',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];

  export const CalificadorasConfigure: TableColumn<any>[] =  [
    {
      label: 'Identificación',
      property: 'identificacion',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
  {
      label: 'Razón Social',
      property: 'razonSocial',
      type: 'text',
      cssClasses: ['font-medium',"texto",'mat-column-width-30','mat-column-max-width-250px']
    },
      {
      label: 'Correo',
      property: 'correo1',
      type: 'text',
      cssClasses: ['font-medium','colortext',"texto-No-Capital"]
    },
    {
     label: 'Contacto',
     property: 'celular',
     type: 'text',
     cssClasses: ['font-medium','colortext',"texto"]
   },
   {
     label: 'Sitio Web',
     property: 'web',
     type: 'text',
     cssClasses: ['font-medium','colortext',"texto-No-Capital"]
   },
    {
      label: 'acciones',
      property: 'acciones',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];

export const casaValoresConfigure: TableColumn<any>[] = [
    {
      label: 'Identificación',
      property: 'identificacion',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
  {
      label: 'Razón Social',
      property: 'razonSocial',
      type: 'text',
      cssClasses: ['font-medium',"texto",'mat-column-width-30','mat-column-max-width-250px']
    },
      {
      label: 'Correo',
      property: 'correo1',
      type: 'text',
      cssClasses: ['font-medium','colortext',"texto-No-Capital"]
    },
   {
     label: 'Sitio Web',
     property: 'web',
     type: 'text',
     cssClasses: ['font-medium','colortext',"texto-No-Capital"]
   },
   {
     label: 'acciones',
     property: 'acciones',
     type: 'button',
     cssClasses: ['text-secondary', 'w-10']
   }
  ];

  export const cutodioTituloConfigure: TableColumn<any>[] = [
    {
      label: 'Identificación',
      property: 'identificacion',
      type: 'text',
      cssClasses: ['font-medium','number']
    },
  { 
      label: 'Razón Social',
      property: 'razonSocial',
      type: 'text',
      cssClasses: ['font-medium',"texto",'mat-column-width-30','mat-column-max-width-250px']
    },
      {
      label: 'Correo',
      property: 'correo1',
      type: 'text',
      cssClasses: ['font-medium','colortext',"texto-No-Capital"]
    },
   {
     label: 'Sitio Web',
     property: 'web',
     type: 'text',
     cssClasses: ['font-medium','colortext',"texto-No-Capital"]
   },
  ];