import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComprobantesRoutingModule } from "./comprobantes-routing.module";
import { AngularMaterialModule } from "../angular-material.module";
import { ComponentsModule } from "src/app/components/components.module";
import { ListadoComprobantesComponent } from "./pages/listado-comprobantes/listado-comprobantes.component";
import { HomeComprobantesComponent } from "./pages/home-comprobantes/home-comprobantes.component";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
import { MentionModule } from "angular-mentions";
import { CardModule } from "primeng/card";
import { TimelineModule } from "primeng/timeline";
import { AppRoutingModule } from "src/app/app-routing.module";
import { TicketsRoutingModule } from "../tickets/tickets-routing.module";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [ListadoComprobantesComponent, HomeComprobantesComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    ComprobantesRoutingModule,
    MatTabsModule,
    TicketsRoutingModule,
    MatFormFieldModule,
    MatButtonModule,
    TimelineModule,

    BrowserAnimationsModule,
    NoopAnimationsModule,
    CardModule,
    MatIconModule,
    MentionModule,
    MatMenuModule,
    ComponentsModule,
  ],
})
export class ComprobantesModule {}
