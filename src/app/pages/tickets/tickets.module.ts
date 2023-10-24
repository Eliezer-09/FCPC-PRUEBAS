import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SolicitarTicketComponent } from "./solicitar-ticket/solicitar-ticket.component";
import { TicketsComponent } from "./tickets.component";
import { TareasTicketComponent } from "./tareas-ticket/tareas-ticket.component";
import { ModalSolicitarTicketComponent } from "./modal-solicitar-ticket/modal-solicitar-ticket.component";
import { MatTabsModule } from "@angular/material/tabs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AngularMaterialModule } from "../angular-material.module";
import { TicketsRoutingModule } from "./tickets-routing.module";
import { MesaAyudaComponent } from "./mesa-ayuda/mesa-ayuda.component";
import { ModalAyudaComponent } from "./mesa-ayuda/modal-ayuda/modal-ayuda.component";
import { ModalReabrirComponent } from "./mesa-ayuda/modal-reabrir/modal-reabrir.component";
import { DetalleTicketComponent } from "./detalle-ticket/detalle-ticket.component";
import { InfoTicketComponent } from "./detalle-ticket/info-ticket/info-ticket.component";
import { ComentarTicketComponent } from "./detalle-ticket/comentar-ticket/comentar-ticket.component";
import { AsignarMiembroComponent } from "./detalle-ticket/info-ticket/asignar-miembro/asignar-miembro.component";
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from "@angular/material/bottom-sheet";
import { EditarTicketComponent } from "./editar-ticket/editar-ticket.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { TimelineModule } from "primeng/timeline";
import { CardModule } from "primeng/card";
import { ComentariosComponent } from "./detalle-ticket/info-ticket/comentarios/comentarios.component";
import { SubtareasComponent } from "./detalle-ticket/info-ticket/subtareas/subtareas.component";
import { DocumentosComponent } from "./detalle-ticket/info-ticket/documentos/documentos.component";
import { TicketsInternoComponent } from "./lista-tickets/tickets-interno/tickets-interno.component";
import { ListaTicketsComponent } from "./lista-tickets/lista-tickets.component";
import { TicketsPendientesComponent } from "./lista-tickets/tickets-pendientes/tickets-pendientes.component";
import { TicketsCompletadosComponent } from "./lista-tickets/tickets-completados/tickets-completados.component";
import { CrearTicketComponent } from "./crear-ticket/crear-ticket.component";
import { TicketTableMenuComponent } from "./lista-tickets/ticket-table-menu/ticket-table-menu.component";
import { MatIconModule } from "@angular/material/icon";

import { MentionModule } from "angular-mentions";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { ComponentsModule } from "../../components/components.module";
@NgModule({
  declarations: [
    SolicitarTicketComponent,
    TicketsComponent,
    TareasTicketComponent,
    ModalSolicitarTicketComponent,
    MesaAyudaComponent,
    ModalAyudaComponent,
    ModalReabrirComponent,
    DetalleTicketComponent,
    InfoTicketComponent,
    ComentarTicketComponent,
    AsignarMiembroComponent,
    EditarTicketComponent,
    ComentariosComponent,
    SubtareasComponent,
    DocumentosComponent,
    TicketsInternoComponent,
    TicketsPendientesComponent,
    TicketsCompletadosComponent,
    ListaTicketsComponent,
    CrearTicketComponent,
    TicketTableMenuComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    MatTabsModule,
    TicketsRoutingModule,
    MatFormFieldModule,
    MatButtonModule,
    TimelineModule,
    CardModule,
    MatIconModule,
    MentionModule,
    MatMenuModule,
    ComponentsModule,
  ],
  exports: [
    SolicitarTicketComponent,
    InfoTicketComponent,
    ComentarTicketComponent,
    TicketsPendientesComponent,
    TicketsCompletadosComponent,
    TicketsInternoComponent,
    CrearTicketComponent,
  ],
  entryComponents: [
    ModalSolicitarTicketComponent,
    ModalAyudaComponent,
    ModalReabrirComponent,
    AsignarMiembroComponent,
    ComentarTicketComponent,
    EditarTicketComponent,
  ],
  providers: [
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true },
    },
  ],
})
export class TicketsModule {}
