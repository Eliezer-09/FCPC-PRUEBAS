import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ToolbarComponent } from "src/@vex/layout/toolbar/toolbar.component";
import { DetalleTicketComponent } from "./detalle-ticket/detalle-ticket.component";
import { MesaAyudaComponent } from "./mesa-ayuda/mesa-ayuda.component";
import { TareasTicketComponent } from "./tareas-ticket/tareas-ticket.component";
import { TicketsInternoComponent } from "./lista-tickets/tickets-interno/tickets-interno.component";
import { TicketsComponent } from "./tickets.component";
import { ListaTicketsComponent } from "./lista-tickets/lista-tickets.component";
import { PermissionsGuard } from "src/app/guards/permissions.guard";

const routes: Routes = [
  {
    path: "consulta",
    component: TicketsComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "tareas-ticket/:idticket/:identificacion/:idTarea",
    component: TareasTicketComponent,
  },
  {
    path: "mesa-ayuda",
    component: MesaAyudaComponent,
  },
  {
    path: "misTickets",
    component: ListaTicketsComponent,
    canActivate: [PermissionsGuard],
    data: { allowedRoles: ["User"] },
  },
  {
    path: "detalle-ticket/:id",
    component: DetalleTicketComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketsRoutingModule {}
