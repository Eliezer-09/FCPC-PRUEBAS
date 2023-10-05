import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NominaRoutingModule } from "./nomina-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "../angular-material.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ScrollbarModule } from "src/@vex/components/scrollbar/scrollbar.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NominaRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    AngularMaterialModule,
    ScrollbarModule,
  ],
  exports: [
    CommonModule,
    NominaRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
  ],
  providers: [],
})
export class NominaModule {}
