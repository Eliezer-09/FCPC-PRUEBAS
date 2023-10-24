import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { IconModule } from "@visurel/iconify-angular";
import { MatDialogModule } from "@angular/material/dialog";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTableModule } from "@angular/material/table";
import {
  MatDatepickerModule,
  MatDatepickerToggle,
} from "@angular/material/datepicker";
import { SecondaryToolbarModule } from "src/@vex/components/secondary-toolbar/secondary-toolbar.module";
import { BreadcrumbsModule } from "src/@vex/components/breadcrumbs/breadcrumbs.module";
import { ContainerModule } from "src/@vex/directives/container/container.module";
import { PageLayoutModule } from "src/@vex/components/page-layout/page-layout.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { SignaturePadModule } from "angular2-signaturepad";
import { MatTableExporterModule } from "mat-table-exporter";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatNativeDateModule } from "@angular/material/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatRadioModule } from "@angular/material/radio";
import { QuillModule } from "ngx-quill";
import { MatSidenavModule } from "@angular/material/sidenav";

//Fuze Module
import { TreeTableModule } from "primeng/treetable";
import { ChipModule } from "primeng/chip";
import { PanelModule } from "primeng/panel";
import { ToggleButtonModule } from "primeng/togglebutton";
import { BreadcrumbModule } from "primeng/breadcrumb";

@NgModule({
  declarations: [],
  imports: [
    MatBottomSheetModule,
    CommonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatStepperModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    SecondaryToolbarModule,
    MatSelectModule,
    IconModule,
    BreadcrumbsModule,
    ContainerModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    PageLayoutModule,
    MatSortModule,
    MatMenuModule,
    FormsModule,
    MatTooltipModule,
    SignaturePadModule,
    MatButtonToggleModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    MatDividerModule,
    MatListModule,
    MatTabsModule,
    MatTableExporterModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatChipsModule,
    QuillModule.forRoot(),
    // MDBBootstrapModule.forRoot(),
    MatRadioModule,
    MatSidenavModule,

    //Fuze Module
    TreeTableModule,
    ChipModule,
    PanelModule,
    ToggleButtonModule,
    BreadcrumbModule,
  ],
  exports: [
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatStepperModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    SecondaryToolbarModule,
    MatTabsModule,
    MatSelectModule,
    IconModule,
    BreadcrumbsModule,
    MatNativeDateModule,
    MatDatepickerToggle,
    MatLabel,
    ContainerModule,
    MatDialogModule,
    MatListModule,
    SignaturePadModule,
    NgxSpinnerModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    PageLayoutModule,
    MatSortModule,
    MatMenuModule,
    FormsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    NgxMatSelectSearchModule,
    MatDatepickerModule,
    MatTableExporterModule,
    MatExpansionModule,
    MatChipsModule,
    QuillModule,
    MatRadioModule,
    MatSidenavModule,

    //Fuze Module
    TreeTableModule,
    ChipModule,
    PanelModule,
    ToggleButtonModule,
    BreadcrumbModule,
  ],
})
export class AngularMaterialModule {}
