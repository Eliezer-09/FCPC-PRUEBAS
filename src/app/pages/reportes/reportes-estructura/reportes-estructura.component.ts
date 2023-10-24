import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { ModalFiltroReportesComponent } from "../../../pages/reportes/modal-filtro-reportes/modal-filtro-reportes.component";
import { map } from "rxjs/operators";
import { ComponentesService } from "src/app/services/componentes.service";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { iconify, iconfa } from "src/static-data/icons";
import { OperationResultReporte, ReporteDTO } from "../../../model/models";
import { ReportesService } from "../reportes.service";
import { TableColumn } from "../../../../@vex/interfaces/table-column.interface";
import { MatTableDataSource } from "@angular/material/table";
import * as FileSaver from "file-saver";
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import { DataService } from "src/app/services/data.service";
import Swal from "sweetalert2";

const moment = _rollupMoment || _moment;

const ELEMENT_DATA: any[] = [
  {
    result: "",
  },
];
@Component({
  selector: "vex-reportes-estructura",
  templateUrl: "./reportes-estructura.component.html",
  styleUrls: ["./reportes-estructura.component.scss"],
  animations: [fadeInUp400ms, stagger80ms],
})
export class ReportesEstructuraComponent implements OnInit {
  isLoading = true;
  isCard = true;
  pageSize = 12;
  infoMessage = "No se ha encontrado reportes de estructura";
  term = "";
  faFileMedicalAlt = iconfa.faFileMedicalAlt;
  faGripHorizontal = iconfa.faGripHorizontal;
  ictwotoneTableChart = iconify.icroundTableChart;
  icroundSearch = iconify.icroundSearch;
  faFileContract = iconfa.faFileContract;
  layoutCtrl = new FormControl("boxed");
  reports = new MatTableDataSource<OperationResultReporte>(ELEMENT_DATA);
  reportsresult: any;
  pageSizeOptions: number[] = [4, 12, 24, 48, 96];
  pageEvent: PageEvent;
  filterValue: string = null;
  isOpen: boolean = false;
  tableColumns: TableColumn<ReporteDTO>[] = [
    {
      label: "Reporte",
      property: "titulo",
      type: "text",
      cssClasses: ["font-medium"],
    },
    {
      label: "Descripción",
      property: "descripcion",
      type: "text",
      cssClasses: ["font-medium"],
    },
    {
      label: "",
      property: "vista",
      type: "button",
      cssClasses: ["text-secondary", "w-10"],
    },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private reportesService: ReportesService,
    private changeDetector: ChangeDetectorRef,
    private componentesService: ComponentesService,
    private dataServices: DataService
  ) {}

  ngOnInit(): void {
    this.loadReports(1, this.pageSize);
  }

  loadReports(page?, size?) {
    this.reportesService
      .getEstructuraReports(page, size)
      .pipe(
        map((reports: any) => {
          this.isLoading = false;
          this.reportsresult = reports;
          this.reports.data = reports.result.sort((a, b) => {
            if (a.codigo > b.codigo) {
              return 1;
            }
            if (a.codigo < b.codigo) {
              return -1;
            }
            return 0;
          });

          this.changeDetector.detectChanges();
        })
      )
      .subscribe();
  }

  onChangeStyleReports(status: boolean) {
    this.isCard = status;
  }

  loadReportsByTerm(page, pageSize) {
    this.reportesService
      .getEstructuraReports(page, pageSize, this.term)
      .pipe(
        map((reports: any) => {
          this.isLoading = false;
          this.reportsresult = reports;
          this.reports.data = reports.result.sort((a, b) => {
            if (a.codigo > b.codigo) {
              return 1;
            }
            if (a.codigo < b.codigo) {
              return -1;
            }
            return 0;
          });

          this.changeDetector.detectChanges();
        })
      )
      .subscribe();
  }

  searchTerm(term: string) {
    this.isLoading = true;
    this.term = term || "";
    if (this.term.length > 0) {
      this.loadReportsByTerm(1, this.pageSize);
    } else {
      this.loadReports(1, this.pageSize);
    }
  }

  openViewFilterReport(report?: ReporteDTO) {
    const idReportes = report["data"] || report["idReporte"];
    if (!this.isOpen) {
      this.isOpen = true;
      this.reportesService
        .getReporteDTOLight(idReportes)
        .pipe(
          map((reporte: any) => {
            report = reporte.result;
            const dialogRef = this.dialog.open(ModalFiltroReportesComponent, {
              maxWidth: "100vw",
              maxHeight: "100vh",
              panelClass: "full-screen-modal",
              data: report || null,
            });

            dialogRef.beforeClosed().subscribe((result) => {
              if (result) {
                
                this.reGenerarData(result);
              }
              this.isOpen = false;
            });
          })
        )
        .subscribe();
    }
  }

  reGenerarData(data){
    let codigo = data["code"];
    let formData = data["formData"];
    this.reportesService.getEstructuraReport(codigo, formData) .subscribe((response) => {
      let registros=response["result"]["registros"]
      if(registros>0){

        Swal.fire({
          icon: "warning",
          title: "¿Deseas recalcular los datos de la estructura?",
          showDenyButton:true,
          denyButtonText: "No",
          confirmButtonText: 'Sí',
          showLoaderOnConfirm: true,
          reverseButtons: true,
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            this.generateReport(data,true)
          } else if (result.isDenied) {
            this.generateReport(data,false)
          }
        })
       
      }else{
        this.generateReport(data,false)
      }
    }); 
  }


  generateReport(data,actualizar) {
    this.spinner.show();
    const codigo = data["code"];
    const format = data["format"];
    let formData = data["formData"];
    this.reportesService
      .getEstructuraReporFile(codigo, format, formData,actualizar)
      .subscribe(
        (response) => {
          const result = response["result"];
          const mimeType = result["mimeType"];
          const filename = result["name"];
          const file = result["file"];
          const fileblob: Blob = this.dataServices.getBlobFromBase64(
            file,
            mimeType
          );
          FileSaver.saveAs(fileblob, filename);

          this.spinner.hide();
        },
        (error) => {
          console.log(error)
          this.componentesService.alerta(
            "error",
            "Ocurrió un error al intentar generar el reporte."
          );
          this.spinner.hide();
        }
      );
  }

  transformDataType(type: string) {
    type = type.toLowerCase();
    if (type === "varchar" || type === "char") {
      return "text";
    } else if (
      type === "date" ||
      type === "datetime" ||
      type === "smalldatetime"
    ) {
      return "date";
    }
    return "number";
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.loadReportsByTerm(page, size);
  }
}
