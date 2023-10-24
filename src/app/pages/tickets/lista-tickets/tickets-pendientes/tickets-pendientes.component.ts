import {
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { map } from "rxjs/operators";
import { OperationResultTickets, Departamento } from "src/app/model/models";
import { TicketsInternos, Areas, TipoTarea } from "../../ticket.interface";
import { TicketsService } from "../../tickets.service";
import icCalendarToday from "@iconify/icons-ic/sharp-calendar-today";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { stagger80ms } from "src/@vex/animations/stagger.animation";
import { LazyLoadEvent, PrimeNGConfig, TreeNode } from "primeng/api";
import { DatePipe, formatDate, DOCUMENT } from "@angular/common";
import Swal from "sweetalert2";
import { ComponentesService } from "src/app/services/componentes.service";
import { DataService } from "src/app/services/data.service";
import { iconify, iconfa } from "src/static-data/icons";
import { LocalService } from "src/app/services/local.service";
@Component({
  selector: "vex-tickets-pendientes",
  templateUrl: "./tickets-pendientes.component.html",
  styleUrls: ["./tickets-pendientes.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [fadeInUp400ms, stagger80ms],
})
export class TicketsPendientesComponent implements OnInit {
  layoutCtrl = new FormControl("boxed");
  searchCtrl = new FormControl();
  termino = new FormControl();
  dataFondoSource = new MatTableDataSource<OperationResultTickets>();
  ticketsInternos: TicketsInternos[];
  isLoading = true;
  tickets: OperationResultTickets = {};
  selection = new SelectionModel<any>(true, []);
  filterValue: string = null;
  estados = [];
  @Input() data: any;

  icCalendarToday = icCalendarToday;
  icroundLocalPlay = iconify.icroundLocalPlay;
  icroundSearch = iconify.icroundSearch;
  faTicketAlt = iconfa.faTicketAlt;
  icroundDelete = iconify.icroundDelete;
  currentRow = 0;
  currentPage = 1;
  pageEvent: PageEvent;
  panelOpenState = false;
  step = 0;
  busquedaAvanzada: boolean = false;
  filtroTermino: string = "";

  files: TreeNode[];
  cols: any[];

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
  controlArea = new FormControl();
  controlDepartment = new FormControl();
  controlTypeTask = new FormControl();
  selectedArea = null;
  selectedDepartment = null;
  departamentos: Departamento[] = [];
  selectArea: Areas[] = [];
  areas: Areas[] = [];
  taskType: TipoTarea[] = [];
  selecttaskType: TipoTarea[] = [];
  infoMessage = "No se ha encontrado Tickets";
  filters = {
    term: null,
    area: null,
    departamento: null,
    tipotarea: null,
    prioridad: null,
    desde: null,
    hasta: null,
  };

  constructor(
    private _ticketsService: TicketsService,
    private changeDetector: ChangeDetectorRef,
    public datepipe: DatePipe,
    private primengConfig: PrimeNGConfig,
    private componentService: ComponentesService,
    private dataService: DataService,
    private localServiceS: LocalService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.files = [];
    this.cols = [
      { field: "nombre", header: "Nombre" },
      { field: "asunto", header: "Asunto" },
      { field: "tipoTarea", header: "Tipo tarea" },
      { field: "prioridad", header: "Prioridad" },
      { field: "departamento", header: "Departamento" },
      { field: "estado", header: "Estado" },
      { field: "fecha", header: "Fecha" },
      { field: "acciones", header: "Acciones" },
    ];

    this.cargarTickets(1, 10);
    this.cargarEstados();
    this.loadfilters();
  }
  loadfilters() {
    this.loadTaskType();
    this.loadArea();
    this.LoadDepartment();
  }

  loadTaskType() {
    this._ticketsService
      .getTiposTarea()
      .pipe(
        map((tasktype: any) => {
          this.taskType = tasktype;
          this.selecttaskType = tasktype;
        })
      )
      .subscribe(() => {
        this.taskType.push({ descripcion: "----None----", idTipoTarea: null });
      });
  }

  loadArea() {
    this.dataService
      .getAreas()
      .pipe(
        map((areas: any) => {
          this.areas = areas.result;
          this.selectArea = areas.result;
        })
      )
      .subscribe(() => {
        this.areas.push({ descripcion: "----None----", idArea: null });
      });
  }

  LoadDepartment() {
    this.dataService
      .getDepartamentos()
      .pipe(
        map((departamentos: any) => {
          this.departamentos = departamentos.result;
        })
      )
      .subscribe(() => {
        this.departamentos.push({
          descripcion: "----None----",
          idDepartamento: null,
        });
      });
  }

  searchTerm(value: string) {
    this.filters.term = value != "" ? value : null;
    this.search();
  }

  searchPriority(value: string) {
    this.filters.prioridad = value;
    this.search();
  }

  searchDeparment(value: number) {
    if (this.selectedDepartment != null) {
      this.selectArea = this.areas.filter(
        (area) => area.idDepartamento == this.selectedDepartment.idDepartamento
      );
      if (this.selectArea.length == 0 || this.selectArea[0].idArea != null) {
        this.selectArea.push({ descripcion: "----None----", idArea: null });
      }
      this.selecttaskType = this.taskType.filter(
        (taskType) =>
          taskType.idDepartamento == this.selectedDepartment.idDepartamento
      );
      if (
        this.selecttaskType.length == 0 ||
        this.selecttaskType[0].idTipoTarea != null
      ) {
        this.selecttaskType.push({
          descripcion: "----None----",
          idTipoTarea: null,
        });
      }
    }
    this.filters.departamento = value;
    this.search();
  }

  searchArea(value: number) {
    this.filters.area = value;
    this.search();
  }

  searchTaskType(value: number) {
    this.filters.tipotarea = value;
    this.search();
  }

  async searchRangeDate(desde?, hasta?) {
    const range = await this.promiseRange(desde, hasta);
    this.filters.desde = range?.fechaDesde || null;
    this.filters.hasta = range?.fechaHasta || null;
    this.search();
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
    this.selectedArea = null;
    this.selectedDepartment = null;
    this.controlArea.reset();
    this.controlDepartment.reset();
    this.controlTypeTask.reset();
    this.controlPriority.reset();
    this.selectArea = this.areas;
    this.selecttaskType = this.taskType;
    this.filters = {
      term: null,
      area: null,
      departamento: null,
      tipotarea: null,
      prioridad: null,
      desde: null,
      hasta: null,
    };
  }

  cargarTickets(page, size) {
    //TODO: CARGAR TICKETS INTERNOS
    this.ticketsInternos = [];
    this.termino.reset();
    this.range.reset();
    this.cleanFilters();
    this._ticketsService
      .getTicketsInterno(page, size, this.data)
      .pipe(
        map((tickets: any) => {
          this.isLoading = false;
          this.files = [];
          this.currentRow =
            tickets.pageNumber * tickets.pageSize - tickets.pageSize + 1;
          this.currentPage = tickets.pageNumber;
          this.tickets = tickets;
          this.tickets.result.forEach((res) => {
            const fecha = this.datepipe.transform(res.fecha);
            let status = res.estado;
            if (status == "Atendido") {
              status = "Completado";
            }
            let node = {
              data: {
                nombre: res.nombre,
                asunto: res.asunto,
                descripcion: res.descripcion,
                espera: res.espera,
                tipoTarea: res.tipoTarea,
                prioridad: res.prioridad,
                area: res.area,
                departamento: res.departamento,
                estado: status,
                fecha: fecha,
                acciones: res.idTicket,
              },
              leaf: true,
              children: [],
            };
            res.tickets.forEach((ticket) => {
              const fecha = this.datepipe.transform(ticket.fecha);
              let status = ticket.estado;
              if (status == "Atendido") {
                status = "Completado";
              }
              const children = {
                data: {
                  nombre: ticket.nombre,
                  asunto: ticket.asunto,
                  descripcion: res.descripcion,
                  espera: res.espera,
                  tipoTarea: ticket.tipoTarea,
                  prioridad: ticket.prioridad,
                  area: res.area,
                  departamento: res.departamento,
                  estado: status,
                  fecha: fecha,
                  acciones: ticket.idTicket,
                },
              };
              node.children.push(children);
            });
            this.files.push(node);
          });
          this.primengConfig.ripple = true;
          this.changeDetector.detectChanges();
        })
      )
      .subscribe((tickets) => {
        this.isLoading = false;
      });
  }

  cargarEstados() {
    this._ticketsService.getEstados().subscribe((res) => {
      this.estados = res;
    });
  }

  loadData(event?: LazyLoadEvent) {
    if (this.termino.value == null) {
      this.isLoading = true;
      const page = (event.first / event.rows + 1).toFixed(0);
      this.cargarTickets(page, event.rows);
    }
  }

  cambiarAvanzado(event) {
    this.busquedaAvanzada = event;
  }

  eliminarTicket(ticket) {
    Swal.fire({
      icon: "warning",
      title: "Desea anular este ticket?",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: `Si, anular`,
    }).then((res) => {
      if (res.isConfirmed) {
        const id = this.localServiceS.getItem("id");
        const data = {
          estado: "Anulado",
          idEntidad: id,
        };
        this._ticketsService.putEstadoTicket(ticket.acciones, data).subscribe(
          (res) => {
            this.componentService.alerta(
              "success",
              "Ticket anulado correctamente"
            );
            this.cargarTickets(this.currentPage, 10);
          },
          (error) => {}
        );
      }
    });
  }

  onPaginator(event?) {
    const page = (event.first / event.rows + 1).toFixed(0);
    const size = event.rows;
    this.search(page, size);
  }

  async search(page?, size?) {
    this.isLoading = true;
    const status = this.data;
    page = page || 1;
    size = size || this.tickets.pageSize;
    this._ticketsService
      .getTicketsInternosByTermino(status, this.filters, page, size)
      .pipe(
        map((userData: any) => {
          this.tickets = userData;
          this.files = [];
          userData["result"].forEach((res) => {
            const fecha = this.datepipe.transform(res.fecha);
            let status = res.estado;
            if (status == "Atendido") {
              status = "Completado";
            }
            let node = {
              data: {
                nombre: res.nombre,
                asunto: res.asunto,
                descripcion: res.descripcion,
                espera: res.espera,
                tiempoAtendido: res.tiempoAtendido,
                tipoTarea: res.tipoTarea,
                prioridad: res.prioridad,
                area: res.area,
                departamento: res.departamento,
                estado: status,
                fecha: fecha,
                acciones: res.idTicket,
              },
              children: [],
            };
            res.tickets.forEach((ticket) => {
              const fecha = this.datepipe.transform(ticket.fecha);
              let status = ticket.estado;
              if (status == "Atendido") {
                status = "Completado";
              }
              const children = {
                data: {
                  nombre: ticket.nombre,
                  asunto: ticket.asunto,
                  descripcion: res.descripcion,
                  espera: res.espera,
                  tipoTarea: ticket.tipoTarea,
                  prioridad: ticket.prioridad,
                  area: res.area,
                  departamento: res.departamento,
                  estado: status,
                  fecha: fecha,
                  acciones: ticket.idTicket,
                },
              };
              node.children.push(children);
            });
            this.files.push(node);
          });
        })
      )
      .subscribe((res) => {
        this.isLoading = false;
      });
    this.changeDetector.detectChanges();
  }
}
