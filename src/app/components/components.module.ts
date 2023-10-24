import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatSpinnerComponent } from "./mat-spinner/mat-spinner.component";
import { NgxSpinnerComponent } from "./ngx-spinner/ngx-spinner.component";
import { AngularMaterialModule } from "../pages/angular-material.module";
import { SimpleCardComponent } from "./simple-card/simple-card.component";
import { InfoMessageComponent } from "./info-message/info-message.component";
import { MatRippleModule } from "@angular/material/core";
import { ViewTableComponent } from "./table/view-table/view-table.component";
import { ScrollbarModule } from "../../@vex/components/scrollbar/scrollbar.module";
import { TooltipsComponent } from "./tooltips/tooltips.component";
import { MatDatepickerMonthYearComponent } from "./Mat-date-formats/mat-datepicker-month-year/mat-datepicker-month-year.component";
import { MatDatepickerYearComponent } from "./Mat-date-formats/mat-datepicker-year/mat-datepicker-year.component";
import { ToastAlertComponent } from "./alerts/toast-alert/toast-alert.component";
import { TableMenuComponent } from "./table-menu/table-menu.component";
import { FilesUploadComponent } from "./files-upload/files-upload.component";
import { FileUploadModule } from "@iplab/ngx-file-upload";
import { DialogAlertComponent } from "./alerts/dialog-alert/dialog-alert.component";
import { HeaderComponent } from "./header/header.component";
import { DropdownTreeviewSComponent } from "./dropdown-treeview/dropdown-treeview.component";
import { TreeviewModule } from "ngx-treeview";
import { AdjuntosGeneralComponent } from "./adjuntos-general/adjuntos-general.component";
import { AdjuntoGeneralComponent } from "./adjuntos-general/adjunto-general/adjunto-general.component";
import { IconDataComponent } from './cards/icon-data/icon-data.component';
import { ViewTableNumericComponent } from "./table/view-table-numeric/view-table-numeric.component";
import { ValuesDataComponent } from "./cards/values-data/values-data.component";

import { ReferenciasBancariasComponent } from "./referencias-bancarias/referencias-bancarias.component";
import { UdpateAdjuntosComponent } from "./adjuntos-general/udpate-adjuntos/update-local-adjuntos.component";
import { ViewAdjuntosComponent } from "./adjuntos-general/view-adjuntos/view-adjuntos.component";
import { ImagePreviewComponent} from "./preview-adjuntos/image-preview/image-preview.component";
import { PreviewAdjuntosComponent } from "./preview-adjuntos/preview-adjuntos.component";

@NgModule({
  declarations: [
    MatSpinnerComponent,
    NgxSpinnerComponent,
    SimpleCardComponent,
    InfoMessageComponent,
    ViewTableComponent,
    HeaderComponent,
    TooltipsComponent,
    MatDatepickerMonthYearComponent,
    MatDatepickerYearComponent,
    ToastAlertComponent,
    TableMenuComponent,
    FilesUploadComponent,
    DialogAlertComponent,
    DropdownTreeviewSComponent,
    ReferenciasBancariasComponent,
    AdjuntosGeneralComponent,
    AdjuntoGeneralComponent,
    IconDataComponent,
    ViewTableNumericComponent,
    ValuesDataComponent,
    UdpateAdjuntosComponent,
    ViewAdjuntosComponent,
    ImagePreviewComponent,
    PreviewAdjuntosComponent
  ],
  exports: [
    NgxSpinnerComponent,
    SimpleCardComponent,
    InfoMessageComponent,
    HeaderComponent,
    ViewTableComponent,
    ToastAlertComponent,
    TooltipsComponent,
    MatDatepickerMonthYearComponent,
    MatDatepickerYearComponent,
    AdjuntosGeneralComponent,
    TableMenuComponent,
    ReferenciasBancariasComponent,
    FilesUploadComponent,
    DialogAlertComponent,
    DropdownTreeviewSComponent,
    IconDataComponent,
    ViewTableNumericComponent,
    ValuesDataComponent,
    ViewAdjuntosComponent,
    UdpateAdjuntosComponent,
    PreviewAdjuntosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    MatRippleModule,
    ScrollbarModule,
    FileUploadModule,
    TreeviewModule.forRoot(),
    FileUploadModule
  ],
  entryComponents: [MatSpinnerComponent],
})
export class ComponentsModule {}
