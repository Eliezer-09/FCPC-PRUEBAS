import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AngularMaterialModule } from "../../angular-material.module";
import { AmortizacionInversionComponent } from "./amortizacion-inversion/amortizacion-inversion.component";
import { FormDataInversionComponent } from "./form-data-inversion/form-data-inversion.component";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { AccordionModule } from "primeng/accordion";
import { ComponentsModule } from "../../../components/components.module";
import { InputMaskModule } from "@ngneat/input-mask";

@NgModule({
  declarations: [AmortizacionInversionComponent, FormDataInversionComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    MatInputModule,
    MatRadioModule,
    InputNumberModule,
    ButtonModule,
    AccordionModule,
    ComponentsModule,
    InputMaskModule,
  ],
  exports: [AmortizacionInversionComponent, FormDataInversionComponent],
})
export class RegistroModule {}
