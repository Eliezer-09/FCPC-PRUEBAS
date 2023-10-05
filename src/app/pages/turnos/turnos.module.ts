import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularMaterialModule } from "../angular-material.module";
import { AppRoutingModule } from "src/app/app-routing.module";
import { MatTabsModule } from "@angular/material/tabs";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatIconModule } from "@angular/material/icon";
import { IconModule } from "@visurel/iconify-angular";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { VideoTurnoComponent } from "./video-turno/video-turno.component";
import { ListaTurnoComponent } from "./lista-turno/lista-turno.component";

@NgModule({
  declarations: [VideoTurnoComponent, ListaTurnoComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    MatTabsModule,
    CommonModule,
    // FlexLayoutModule,
    // MatIconModule,
    // IconModule,
    // MatTooltipModule,
    // MatButtonModule,
  ],
  exports: [VideoTurnoComponent, ListaTurnoComponent],
})
export class TurnosModule {}
