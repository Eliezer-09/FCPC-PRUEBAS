import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagesComponent } from "./pages.component";
import { AngularMaterialModule } from "./angular-material.module";
import { AppRoutingModule } from "../app-routing.module";
import { ComponentesModule } from "./creditos/prestamos-aprobados/componentes/componentes.module";
import { ParticipesModule } from "./participes/participes.module";
import { CreditosModule } from "./creditos/creditos.module";
import { ContratosModule } from "./contratos/contratos.module";
import { ComponentsModule } from "../components/components.module";
import { BrowserModule } from "@angular/platform-browser";
import { AtencionUsuarioComponent } from "./atencion-usuario/atencion-usuario.component";
import { SolicitarTicketComponent } from "./tickets/solicitar-ticket/solicitar-ticket.component";
import { TicketsComponent } from "./tickets/tickets.component";
import { ParticipeComponent } from "./participe/participe.component";
import { DataService } from "../services/data.service";
import { MatIconModule } from "@angular/material/icon";
import { TareasTicketComponent } from "./tickets/tareas-ticket/tareas-ticket.component";
import { ModalInfoComponent } from "./tickets/modal-info/modal-info.component";
import { TurnosComponent } from "./turnos/turnos.component";
import { TurnosModule } from "./turnos/turnos.module";
import { ErrorsModule } from "./errors/errors.module";
import { ModalPagareFirmadoComponent } from "./creditos/modal-pagare-firmado/modal-pagare-firmado.component";
import { InversionesModule } from "./inversiones/inversiones.module";
import { TicketsModule } from "./tickets/tickets.module";
import { ReportesModule } from "./reportes/reportes.module";

@NgModule({
  declarations: [
    PagesComponent,
    AtencionUsuarioComponent,
    ParticipeComponent,
    ModalInfoComponent,
    TurnosComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    ParticipesModule,
    CreditosModule,
    ContratosModule,
    ComponentesModule,
    ComponentsModule,
    MatIconModule,
    TurnosModule,
    ErrorsModule,
    InversionesModule,
    TicketsModule,
    ReportesModule,
  ],
  providers: [DataService],
  exports: [PagesComponent, AtencionUsuarioComponent, ModalInfoComponent],
  entryComponents: [
    ModalInfoComponent,
    ModalPagareFirmadoComponent,

  ],
})
export class PagesModule {}
