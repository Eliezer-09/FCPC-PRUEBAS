import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegistroComponent } from "./registro/registro.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "../angular-material.module";
import { AppRoutingModule } from "src/app/app-routing.module";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { InversionesService } from "./inversiones.service";
import { CatalogoInversionComponent } from "./catalogo-inversion/catalogo-inversion.component";
import { InversionesActivasComponent } from "./inversiones-activas/inversiones-activas.component";
import { VectorModule } from "./vector/vector.module";
import { RegistroModule } from "./registro/registro.module";
import { CatalogoInversionModule } from "./catalogo-inversion/catalogo-inversion.module";
import { InversionRoutingModule } from "./inversion-routing.module";
import "animate.css";
import { DetallesInversionComponent } from "./inversiones-activas/detalles-inversion/detalles-inversion.component";
import { AdjuntosComponent } from "./inversiones-activas/detalles-inversion/adjuntos/adjuntos.component";
import { TablaAmortizacionComponent } from "./inversiones-activas/detalles-inversion/tabla-amortizacion/tabla-amortizacion.component";

import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { AccordionModule } from "primeng/accordion";
import { KeyFilterModule } from "primeng/keyfilter";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { ComponentsModule } from "../../components/components.module";
import { DataInversionComponent } from "./inversiones-activas/detalles-inversion/data-inversion/data-inversion.component";
import { PricesHistoryComponent } from "./inversiones-activas/detalles-inversion/prices-history/prices-history.component";
import { ChartModule } from "../../../@vex/components/chart/chart.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { InputMaskModule } from "@ngneat/input-mask";

@NgModule({
  declarations: [
    RegistroComponent,
    CatalogoInversionComponent,
    InversionesActivasComponent,
    DetallesInversionComponent,
    AdjuntosComponent,
    TablaAmortizacionComponent,
    DataInversionComponent,
    PricesHistoryComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    AngularMaterialModule,
    RegistroModule,
    CatalogoInversionModule,
    AppRoutingModule,
    MatInputModule,
    MatRadioModule,
    InputMaskModule,
    InversionRoutingModule,
    InputNumberModule,
    ButtonModule,
    AccordionModule,
    KeyFilterModule,
    InputTextModule,
    MessageModule,
    ComponentsModule,
    ChartModule,
    NgApexchartsModule,
    VectorModule,
  ],
  providers: [InversionesService],
  exports: [AdjuntosComponent, TablaAmortizacionComponent, InputMaskModule],
})
export class InversionesModule {}
