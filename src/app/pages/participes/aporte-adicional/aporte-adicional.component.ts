import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  AfterViewChecked,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { UntilDestroy } from "@ngneat/until-destroy";
import { map } from "rxjs/operators";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { iconify } from "src/static-data/icons";
import { OperationResultParticipe, Participe } from "src/app/model/models";
import { TableColumn } from "../../../../@vex/interfaces/table-column.interface";
import { OperationResultPrestamo } from "../../../model/models";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { ToastAlertComponent } from "../../../components/alerts/toast-alert/toast-alert.component";
import { ParticipesService } from "../participes.service";
import * as XLSX from "xlsx";
import icDownload from "@iconify/icons-fa-solid/download";
import { ComponentesService } from "src/app/services/componentes.service";

export const AportesAdicionalesConfigure: TableColumn<any>[] = [
  {
    label: "Nombre",
    property: "nombre",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },

  {
    label: "Identificación",
    property: "identificacion",
    type: "text",
    cssClasses: ["font-medium", "texto"],
  },

  {
    label: "fecha",
    property: "fecha",
    type: "text",
    cssClasses: ["font-medium", "colortext", "fecha"],
  },
  {
    label: "Monto",
    property: "aporte",
    type: "text",
    cssClasses: ["font-medium", "colortext", "decimal"],
  },
  {
    label: "Origen",
    property: "medio",
    type: "text",
    cssClasses: ["font-medium", "colortext"],
  },
  {
    label: "opciones",
    property: "acciones",
    type: "button",
    cssClasses: ["text-secondary", "w-10"],
  },
];

const ELEMENT_DATA: any[] = [{ result: "" }];

@UntilDestroy()
@Component({
  selector: "vex-aporte-adicional",
  templateUrl: "./aporte-adicional.component.html",
  styleUrls: ["./aporte-adicional.component.scss"],
  animations: [fadeInUp400ms, stagger80ms, fadeInRight400ms],
})
export class AporteAdicionalComponent implements OnInit, AfterViewChecked {
  pageSize = 10;
  isLoading = true;
  infoMessage = "No se ha encontrado aportes adicionales";
  term = "";
  icDownload = icDownload;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataFondoSource = new MatTableDataSource<OperationResultPrestamo>(
    ELEMENT_DATA
  );
  searchCtrl = new FormControl();
  layoutCtrl = new FormControl("boxed");

  aportes: any = {};
  pageEvent: PageEvent;
  filterValue: string = null;
  icroundSearch = iconify.icroundSearch;
  icroundNoteAdd = iconify.icroundNoteAdd;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("toastAlertComponent") toastAlertComponent: ToastAlertComponent;
  tableColumns: TableColumn<Participe>[] = AportesAdicionalesConfigure;
  menuOption = [
    {
      name: "Ver Documento",
      icon: "manage_search",
      type: "function",
      accion: "donwload",
    },
  ];

  constructor(
    private participesService: ParticipesService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private componentService: ComponentesService
  ) {}

  ngOnInit() {
    this.servicesAportesAdicionalesByTerm(1, this.pageSize);
  }

  getDocumentoAporteAdicional(idEntidad, monto) {
    this.spinner.show();
    this.participesService
      .getDocumentoAporteAdicional(idEntidad, monto)
      .subscribe(
        (res) => {
          var link = document.createElement("a");
          link.setAttribute("download", "aporte");
          link.style.display = "none";
          document.body.appendChild(link);
          window.open(res["changingThisBreaksApplicationSecurity"]);
          document.body.removeChild(link);
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          try {
            new ToastAlertComponent("error", error.error.message);
          } finally {
            this.spinner.hide();
          }
        }
      );
  }

  servicesAportesAdicionalesByTerm(page, pageSize) {
    this.participesService
      .getAportesAdicionales(page, pageSize, this.term)
      .pipe(
        map((aporte: OperationResultParticipe) => {
          this.isLoading = false;
          this.aportes = aporte;
          this.dataFondoSource.data = aporte["result"];
          this.changeDetector.detectChanges();
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.dataFondoSource.sort = this.sort;
    this.dataFondoSource.paginator = this.paginator;
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  searchTerm(term: string) {
    this.isLoading = true;
    this.term = term || "";
    this.servicesAportesAdicionalesByTerm(1, this.pageSize);
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.servicesAportesAdicionalesByTerm(page, size);
  }

  actionMenu(event) {

    if (event.data.firmadoDigitalmente) {
      window.open(event.data?.url);
      return;
    }
    let data = event.data;
    if (event.action === "donwload") {
      this.getDocumentoAporteAdicional(data["idEntidad"], data["aporte"]);
    }
  }

  descargarAportes() {
    this.isLoading = true;
    this.participesService
      .getAportesAdicionales(1, 10, this.term, true)
      .subscribe((response) => {
        this.isLoading = false;
        let fecha = new Date();
        let format = this.datepipe.transform(fecha, "dd-MM-yyyy HH:mm");

        const array = [];
        response["result"].forEach((res) => {
          const objeto = {
            nombre: res["nombre"],
            identificacion: res["identificacion"],
            fecha: this.datepipe.transform(res["fecha"], "dd/MM/yyyy"),
            aporte: res["aporte"],
            origen: res["medio"],
          };
          array.push(objeto);
        });
        const workSheet = XLSX.utils.json_to_sheet(array);
        const workBook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "SheetName");
        XLSX.writeFile(workBook, "Aportes Adicionales_" + format + ".xlsx");
      });
  }
}
