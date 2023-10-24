import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalEditDatosBancariosComponent } from "./modal-edit-datos-bancarios.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "src/app/pages/angular-material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,

    AngularMaterialModule,
  ],
  declarations: [ModalEditDatosBancariosComponent],
  exports: [ModalEditDatosBancariosComponent],
})
export class ModalDatosBancariosModule {}
