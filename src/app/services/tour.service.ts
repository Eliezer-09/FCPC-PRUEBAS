import { Injectable } from "@angular/core";
// import { TourService } from "ngx-ui-tour-md-menu";

@Injectable({
  providedIn: 'root'
})
export class TourServices {
  constructor( 
    // private readonly tourService: TourService
  ){

  }

  // loadTour(){
  //   this.tourService.initialize([
  //     {
  //     anchorId: 'busqueda',
  //     title: 'Busqueda de modulos',
  //     content: 'La busuqeda de modulos permite navegar por los diferentes modulos de la aplicacion',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'sucursales',
  //     title: 'Sucursales',
  //     content: 'Permite seleccionar las sucursales de la empresa',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'verTickets',
  //     title: 'Ver Tickets',
  //     content: 'Notificaciones de los tickets ya sean recibidos o enviados',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'crearTicket',
  //     title: 'Crear Ticket',
  //     content: 'Permite crear un nuevo ticket',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'filtroDeBusqueda',
  //     title: 'Filtro de Busqueda',
  //     content: 'Permite buscar por diferentes filtros',
  //     route: 'inicio',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'itemsNav',
  //     title: 'Items de Navegacion',
  //     content: 'Permite navegar por los diferentes items de la aplicacion',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'search',
  //     title: 'Busqueda',
  //     content: 'Envia a la pantalla inicial de busqueda',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'entidades',
  //     title: 'Entidades',
  //     content: 'Contiene las opciones de consultar, crear y editar entidades',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'Polizas',
  //     title: 'Polizas',
  //     content: 'Contiene las opciones de consultar, crear y editar polizas',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'Sinisestros',
  //     title: 'Siniestros',
  //     content: 'Contiene las opciones de consultar, crear y editar siniestros',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'Catalogo',
  //     title: 'Catalogo',
  //     content: 'Brinda las opciones de consultar, crear y editar catalogos',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'Tickets',
  //     title: 'Tickets',
  //     content: 'Permite la administracion de los tickets',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   {
  //     anchorId: 'Productos',
  //     title: 'Productos',
  //     content: 'Permite la administracion de los productos',
  //     enableBackdrop: true,
  //     nextBtnTitle: 'Siguiente',
  //     prevBtnTitle: 'Anterior',
  //     endBtnTitle: 'Finalizar',
  //   },
  //   ]);
  // }

  // loadTourTicket(){
  //   this.tourService.initialize([
  //     {
  //       anchorId: 'estado',
  //       title: 'Estado del Ticket',
  //       content: 'Permite cambiar el estado del ticket',
  //       enableBackdrop: true,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'tags',
  //       title: 'Tags del ticket',
  //       content: 'Permite agregar tags a un ticket y eliminarlo',
  //       enableBackdrop: true,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'asignar',
  //       title: 'Asignar ticket',
  //       content: 'Permite asignar un ticket a un empleado y poder ver los posibles asignados',
  //       enableBackdrop: true,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'botonAsignar',
  //       title: 'Boton de asignar',
  //       content: 'Permite asignar un ticket a un empleado',
  //       enableBackdrop: true,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'botonCrearSubticket',
  //       title: 'Boton de crear subticket',
  //       content: 'Permite crear un subticket a partir de un ticket',
  //       enableBackdrop: true,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'botonEditarTicket',
  //       title: 'Boton de editar ticket',
  //       content: 'Permite editar el detalle del ticket',
  //       enableBackdrop: true,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //   ])
  // }

  // loadTourCrearTicket(){
  //   this.tourService.initialize([
  //     {
  //       anchorId: 'tipoTarea',
  //       title: 'Tipo de tarea',
  //       content: 'Permite seleccionar el tipo de tarea',
  //       enableBackdrop: false,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'area',
  //       title: 'Area por tipo tarea',
  //       content: 'Permite agregar tags a un ticket',
  //       enableBackdrop: false,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'ticketTtags',
  //       title: 'Tags del ticket',
  //       content: 'Permite agregar tags a un ticket',
  //       enableBackdrop: false,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'asunto',
  //       title: 'Asunto',
  //       content: 'Permite ingresar el asunto del ticket ',
  //       enableBackdrop: false,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'detalle',
  //       title: 'Detalle',
  //       content: 'Permite ingresar el detalle del ticket',
  //       enableBackdrop: false,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'adjunto',
  //       title: 'Adjunto',
  //       content: 'Permite adjuntar archivos al ticket',
  //       enableBackdrop: false,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     },
  //     {
  //       anchorId: 'cancelar',
  //       title: 'Cancelar',
  //       content: 'Permite cancelar la creacion del ticket',
  //       enableBackdrop: false,
  //       nextBtnTitle: 'Siguiente',
  //       prevBtnTitle: 'Anterior',
  //       endBtnTitle: 'Finalizar',
  //     }
  //   ])
  // }

  // start(){
  //   this.tourService.start();
  // }
}
