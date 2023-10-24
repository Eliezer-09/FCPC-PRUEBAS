import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { map } from "rxjs/operators";

import icCalendarToday from "@iconify/icons-ic/sharp-calendar-today";
import { TreeNode } from "primeng/api";
import { DatePipe, formatDate } from "@angular/common";
import Swal from "sweetalert2";
import { ComponentesService } from "src/app/services/componentes.service";
import { iconify, iconfa } from "src/static-data/icons";
import {
  TicketsInternos,
  Areas,
  TipoTarea,
} from "src/app/pages/tickets/ticket.interface";
import { ComprobanteService } from "../../comprobantes.service";
import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import { MatTableDataSource } from "@angular/material/table";
import {
  OperationResultParticipe,
  OperationResultPrestamo,
} from "src/app/model/models";
import { MatSort } from "@angular/material/sort";
import { UtilsService } from "src/app/pages/colaboradores/utils/utils.service";
const ELEMENT_DATA: any[] = [{ result: "" }];
@Component({
  selector: "vex-listado-comprobantes",
  templateUrl: "./listado-comprobantes.component.html",
  styleUrls: ["./listado-comprobantes.component.scss"],
})
export class ListadoComprobantesComponent implements OnInit, AfterViewInit {
  dataFondoSource = new MatTableDataSource<OperationResultPrestamo>(
    ELEMENT_DATA
  );
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isLoading = true;
  comprobantes;
  filterValue: string = null;
  estados = [];

  icCalendarToday = icCalendarToday;
  icroundLocalPlay = iconify.icroundLocalPlay;
  icroundSearch = iconify.icroundSearch;
  faTicketAlt = iconfa.faTicketAlt;
  icroundDelete = iconify.icroundDelete;
  currentPage = 1;
  pageEvent: PageEvent;
  panelOpenState = false;
  step = 0;
  busquedaAvanzada: boolean = false;
  filtroTermino: string = "";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  prioridades = [
    { descripcion: "Urgente", valor: "Urgente" },
    { descripcion: "Alta", valor: "Alta" },
    { descripcion: "Media", valor: "Media" },
    { descripcion: "Baja", valor: "Baja" },
    { descripcion: "--None--", valor: null },
  ];

  controlPriority = new FormControl();
  controlTipoComprobante = new FormControl();
  controlTipoEstado = new FormControl();
  controlTipoEmision = new FormControl();
  controlTypeTask = new FormControl();
  selectedDepartment = null;
  departamentos;
  selectArea: Areas[] = [];
  areas: Areas[] = [];
  taskType: TipoTarea[] = [];
  selecttaskType: TipoTarea[] = [];
  infoMessage = "No se ha encontrado comprobantes";
  filters = {
    term: null,
    tipoComprobante: null,
    tipoEmision: null,
    estado: null,
    departamento: null,
    tipotarea: null,
    prioridad: null,
    desde: null,
    hasta: null,
  };
  tiposComprobantes = [
    { idTipoComprobante: 1, descripcion: "Factura" },
    {
      idTipoComprobante: 2,
      descripcion: "Liquidación de compras de bienes y prestación de servicios",
    },
    { idTipoComprobante: 3, descripcion: "Notas de Crédito" },
    { idTipoComprobante: 4, descripcion: "Notas de Débito" },
    { idTipoComprobante: 5, descripcion: "Comprobante de Retención" },
  ];
  tiposEstado = [
    {
      idEstado: 1,
      descripcion: "Creado",
    },
    {
      idEstado: 2,
      descripcion: "Procesado",
    },
    {
      idEstado: 3,
      descripcion: "Firmado",
    },
    {
      idEstado: 4,
      descripcion: "Enviado",
    },
    {
      idEstado: 5,
      descripcion: "Autorizado",
    },
    {
      idEstado: 5,
      descripcion: "Devuelto",
    },
  ];

  tiposEmision = [
    { idTipoEmision: 1, descripcion: "Normal" },
    { idTipoEmision: 2, descripcion: "Indisponibilidad del sistema" },
    { idTipoEmision: 3, descripcion: "Contingencia" },
  ];

  tableColumns: TableColumn<any>[] = [
    {
      label: "Cédula",
      property: "identificacion",
      type: "text",
      cssClasses: ["font-medium", "number"],
    },
    {
      label: "Nombres",
      property: "nombre",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: " Nro. Comprobante ",
      property: "numeroComprobante",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },
    {
      label: "Tipo de comprobante",
      property: "tipoComprobante",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },

    {
      label: "Estado",
      property: "resultado",
      type: "text",
      cssClasses: ["font-medium", "colortext", "texto"],
    },

    {
      label: "Fecha de emisión",
      property: "fechaEmision",
      type: "text",
      cssClasses: ["font-medium", "fecha"],
    },

    {
      label: "acciones",
      property: "acciones",
      type: "button",
      cssClasses: ["text-secondary", "w-20"],
    },
  ];

  menuOption = [
    {
      name: "Descargar XML",
      //icon xml

      icon: "description",
      type: "function",
      accion: "document",
    },
    {
      name: "Descargar RIDE",
      icon: "picture_as_pdf",
      type: "function",
      accion: "pdf",
    },
    {
      name: "Enviar comprobante",
      icon: "email",
      type: "function",
      accion: "email",
    },
  ];
  pageSize = 10;
  size: any;

  comprobantesResult: OperationResultParticipe;

  constructor(
    private _comprobanteService: ComprobanteService,
    public datepipe: DatePipe,
    public utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getComprobantes(1, this.pageSize);
  }

  ngAfterViewInit() {
    this.dataFondoSource.sort = this.sort;
    this.dataFondoSource.paginator = this.paginator;
  }

  searchTerm(value: string) {
    this.filters.term = value != "" ? value : null;
    this.getComprobantes(1, this.pageSize);
  }

  searchEstado(value: string) {
    this.filters.estado = value;
    this.getComprobantes(1, this.pageSize);
  }

  searchTipoComprobante(value: number) {
    this.filters.tipoComprobante = value;
    this.getComprobantes(1, this.pageSize);
  }

  async searchRangeDate(desde?, hasta?) {
    if (desde == null && hasta == null) {
      this.filters.desde = null;
      this.filters.hasta = null;
      this.range.reset();
      this.getComprobantes(1, this.pageSize);
      return;
    }
    const range = await this.promiseRange(desde, hasta);
    this.filters.desde = range?.fechaDesde || null;
    this.filters.hasta = range?.fechaHasta || null;
    this.getComprobantes(1, this.pageSize);
  }

  promiseRange = async (
    desde,
    hasta
  ): Promise<Record<string, number | string>> => {
    const response = await this.formatDate(desde, hasta);
    return response;
  };

  formatDate(desde?, hasta?) {
    let range;
    if (desde && hasta) {
      const fechaDesde = formatDate(desde, "yyyy-MM-dd", "en-US");
      const fechaHasta = formatDate(hasta, "yyyy-MM-dd", "en-US");
      range = { fechaDesde: fechaDesde, fechaHasta: fechaHasta };
    }
    return range;
  }

  cleanFilters() {
    this.controlTipoComprobante.reset();
    this.controlTipoEstado.reset();
    this.controlTipoEmision.reset();
    this.range.reset();

    this.filters = {
      term: null,
      tipoComprobante: null,
      tipoEmision: null,
      estado: null,
      departamento: null,
      tipotarea: null,
      prioridad: null,
      desde: null,
      hasta: null,
    };

    this.getComprobantes(1, this.pageSize);
  }

  cambiarAvanzado(event) {
    this.busquedaAvanzada = event;
  }

  getComprobantes(page, size) {
    this._comprobanteService
      .getComprobantesByTermino(this.filters, page, size)
      .pipe(
        map((empelados: OperationResultParticipe) => {
          this.isLoading = false;
          this.comprobantesResult = empelados;
          this.dataFondoSource.data =
            empelados["result"].length > 0 ? empelados["result"] : [];
        })
      )
      .subscribe(
        (res) => {},
        (error) => {
          this.dataFondoSource.data = [];
          this.isLoading = false;
        }
      );
  }

  actionMenu(event) {
    if (event.action == "document") {
      window.location.href = event.data.xml;
    }
    if (event.action == "pdf") {
      window.location.href = event.data.ride;
    }
    if (event.action == "email") {
      this.enviarComprobante(event.data);
    }
  }

  enviarComprobante(data) {
    this._comprobanteService.enviarComprobante(data.correo, data.id);
  }

  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.getComprobantes(page, size);
  }
}
