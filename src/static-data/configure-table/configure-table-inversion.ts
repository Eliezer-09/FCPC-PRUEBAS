import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import { Participe } from "src/app/model/models";

export const InversionConfigure: TableColumn<Participe>[] =  [
    {
      label: 'no. certificado',
      property: 'numeroCertificado',
      type: 'text',
      cssClasses: ['font-medium','number','mat-column-width-10']
    },
    {
      label: 'Serie Transacción',
      property: 'serieTransaccion',
      type: 'text',
      cssClasses: ['font-medium','texto','mat-column-width-10']
    },
  {
      label: 'emisor',
      property: 'emisor',
      type: 'text',
      cssClasses: ['font-medium',"texto",'mat-column-width-30','mat-column-min-width-250px']
    },
      {
      label: 'tipo de inversión',
      property: 'tipoInversion',
      type: 'text',
      cssClasses: ['font-medium','colortext',"texto",'mat-column-width-20']
    },
    {
      label: 'valor nominal',
      property: 'valorNominal',
      type: 'text',
      cssClasses: ['font-medium','colortext','decimal']
    },
    {
      label: 'tasa',
      property: 'tasa',
      type: 'text',
      cssClasses: ['font-medium','colortext','decimal-porcent']
    },  
   {
      label: 'fecha emisión',
      property: 'fechaEmision',
      type: 'text',
      cssClasses: ['font-medium','colortext','fecha']
    }, 
    {
      label: 'fecha vencimiento',
      property: 'fechaVencimiento',
      type: 'text',
      cssClasses: ['font-medium','colortext','fecha']
    }, 
    {
      label: 'opciones',
      property: 'acciones',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];