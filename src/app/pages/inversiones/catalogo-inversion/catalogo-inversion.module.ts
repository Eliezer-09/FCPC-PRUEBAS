import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalificadaRiesgosComponent } from "./calificadora-riesgos/calificadora-riesgos.component";
import { EmisoresValoresComponent } from "./emisores-valores/emisores-valores.component";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AngularMaterialModule } from "../../angular-material.module";
import { ComponentsModule } from "../../../components/components.module";
import { CalificacionEmisorComponent } from "./calificacion-emisor/calificacion-emisor.component";
import { FormCalificadoraRiesgosComponent } from "./calificadora-riesgos/form-calificadora-riesgos/form-calificadora-riesgos.component";
import { ControllerCalificadoraComponent } from "./calificadora-riesgos/controller-calificadora/controller-calificadora.component";
import { ViewCalificadoraRiesgosComponent } from "./calificadora-riesgos/view-calificadora-riesgos/view-calificadora-riesgos.component";
import { CustidioTituloComponent } from "./custidio-titulo/custidio-titulo.component";
import { CasaValoresComponent } from "./casa-valores/casa-valores.component";
import { FormEmisorComponent } from "./emisores-valores/form-emisor/form-emisor.component";
import { ControllerEmisorComponent } from "./emisores-valores/controller-emisor/controller-emisor.component";
import { ViewEmisorComponent } from "./emisores-valores/view-emisor/view-emisor.component";
import { FormCasaValorComponent } from "./casa-valores/form-casa-valor/form-casa-valor.component";
import { ControllerCasaValorComponent } from "./casa-valores/controller-casa-valor/controller-casa-valor.component";
import { ViewCasaValorComponent } from "./casa-valores/view-casa-valor/view-casa-valor.component";
@NgModule({
  declarations: [
    CalificadaRiesgosComponent,
    EmisoresValoresComponent,
    CalificacionEmisorComponent,
    FormCalificadoraRiesgosComponent,
    ControllerCalificadoraComponent,
    ViewCalificadoraRiesgosComponent,
    CustidioTituloComponent,
    CasaValoresComponent,
    FormEmisorComponent,
    ControllerEmisorComponent,
    ViewEmisorComponent,
    FormCasaValorComponent,
    ControllerCasaValorComponent,
    ViewCasaValorComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule,
    MatInputModule,
    MatRadioModule,
    ComponentsModule,
  ],
  exports: [
    CalificadaRiesgosComponent,
    EmisoresValoresComponent,
    CustidioTituloComponent,
    CasaValoresComponent,
  ],
})
export class CatalogoInversionModule {}
